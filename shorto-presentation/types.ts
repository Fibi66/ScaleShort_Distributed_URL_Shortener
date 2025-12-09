import React from 'react';

export interface NavItem {
  label: string;
  id: string;
}

export interface TechItem {
  category: string;
  items: string[];
  icon: React.ReactNode;
}