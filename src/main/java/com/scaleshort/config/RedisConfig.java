package com.scaleshort.config;

import io.lettuce.core.ReadFrom;
import io.lettuce.core.SocketOptions;
import io.lettuce.core.TimeoutOptions;
import io.lettuce.core.cluster.ClusterClientOptions;
import io.lettuce.core.cluster.ClusterTopologyRefreshOptions;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.connection.RedisClusterConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.List;

@Configuration
@Profile("cluster")
public class RedisConfig {
    
    @Value("${spring.redis.cluster.nodes}")
    private List<String> clusterNodes;
    
    @Value("${spring.redis.cluster.max-redirects:3}")
    private int maxRedirects;
    
    @Value("${spring.redis.timeout:2000ms}")
    private Duration commandTimeout;
    
    @Value("${spring.redis.connect-timeout:5000ms}")
    private Duration connectTimeout;
    
    @Value("${spring.redis.lettuce.pool.max-active:16}")
    private int maxActive;
    
    @Value("${spring.redis.lettuce.pool.max-idle:8}")
    private int maxIdle;
    
    @Value("${spring.redis.lettuce.pool.min-idle:4}")
    private int minIdle;
    
    @Value("${spring.redis.lettuce.pool.max-wait:-1ms}")
    private long maxWait;
    
    @Bean
    public LettuceConnectionFactory lettuceConnectionFactory() {
        RedisClusterConfiguration clusterConfig = new RedisClusterConfiguration(clusterNodes);
        clusterConfig.setMaxRedirects(maxRedirects);
        
        // Socket options for connection timeout
        SocketOptions socketOptions = SocketOptions.builder()
                .connectTimeout(connectTimeout)
                .keepAlive(true)
                .tcpNoDelay(true)
                .build();
        
        // Topology refresh for cluster node discovery
        ClusterTopologyRefreshOptions topologyRefreshOptions = ClusterTopologyRefreshOptions.builder()
                .enablePeriodicRefresh(Duration.ofMinutes(1))
                .enableAllAdaptiveRefreshTriggers()
                .adaptiveRefreshTriggersTimeout(Duration.ofSeconds(30))
                .build();
        
        // Client options with socket and timeout configuration
        ClusterClientOptions clientOptions = ClusterClientOptions.builder()
                .socketOptions(socketOptions)
                .topologyRefreshOptions(topologyRefreshOptions)
                .timeoutOptions(TimeoutOptions.enabled(commandTimeout))
                .disconnectedBehavior(ClusterClientOptions.DisconnectedBehavior.REJECT_COMMANDS)
                .validateClusterNodeMembership(false)
                .build();
        
        // Connection pool configuration
        GenericObjectPoolConfig<?> poolConfig = new GenericObjectPoolConfig<>();
        poolConfig.setMaxTotal(maxActive);
        poolConfig.setMaxIdle(maxIdle);
        poolConfig.setMinIdle(minIdle);
        poolConfig.setMaxWaitMillis(maxWait);
        poolConfig.setTestWhileIdle(true);
        poolConfig.setTimeBetweenEvictionRunsMillis(30000);
        
        // Build Lettuce client configuration with pooling
        LettuceClientConfiguration clientConfig = LettucePoolingClientConfiguration.builder()
                .clientOptions(clientOptions)
                .readFrom(ReadFrom.REPLICA_PREFERRED)
                .commandTimeout(commandTimeout)
                .poolConfig(poolConfig)
                .build();
        
        return new LettuceConnectionFactory(clusterConfig, clientConfig);
    }
    
    @Bean
    public RedisTemplate<String, String> redisTemplate(LettuceConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new StringRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }
}