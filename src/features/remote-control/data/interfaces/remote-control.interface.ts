import { IoniconsIconName } from "@react-native-vector-icons/ionicons";
import { RokuRemoteCommand } from "../../services/roku-remote.service";

export interface VoiceButtonProps {
    isListening: boolean;
    disabled?: boolean;
    onPress: () => void;
    listeningText: string;
    idleText: string;
    accessibilityLabel: string;
    accessibilityHint: string;
}

export interface GridButtonConfig {
    iconName: IoniconsIconName;
    label: string;
    command: RokuRemoteCommand;
    color: string;
    variant?: 'soft' | 'filled';
    size?: 'sm' | 'md' | 'lg';
}
