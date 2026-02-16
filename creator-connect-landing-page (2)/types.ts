import React from 'react';

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface CollabStrategy {
  match_suggestions: string[];
  viral_concept: string;
  barter_opportunities: string[];
  welcome_message: string;
}

export interface WaitlistForm {
  name: string;
  email: string;
  niche: string;
  city: string;
}