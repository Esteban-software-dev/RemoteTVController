import { ReactNode } from 'react';
import { RokuApp } from './roku-app.interface';
import { IoniconsIconName } from '@react-native-vector-icons/ionicons';

export type SmartHubSectionType = {
    type: 'favorites' | 'apps' | 'recent' | 'pinned' | 'system';
    data: RokuApp[];
    title?: string;
    subtitle?: string;
    actionButton?: ReactNode;
    iconName?: IoniconsIconName;
    scrollType: 'horizontal' | 'vertical';
};
