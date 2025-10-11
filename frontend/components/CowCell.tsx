import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const COW_COLORS = [
  { emoji: '🐄', bg: '#ff6b6b', shadow: '#c92a2a' }, // Red
  { emoji: '🐮', bg: '#4ecdc4', shadow: '#0a9699' }, // Cyan
  { emoji: '🐄', bg: '#ffe66d', shadow: '#f0b429' }, // Yellow
  { emoji: '🐮', bg: '#a8e6cf', shadow: '#56ab91' }, // Green
  { emoji: '🐄', bg: '#ff8b94', shadow: '#c95d63' }, // Pink
];

interface CowCellProps {
  color: number;
  row: number;
  col: number;
  size: number;
  isSelected: boolean;
  onPress: () => void;
}

const CowCell: React.FC<CowCellProps> = ({ color, size, isSelected, onPress }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (color === -1) {
      opacity.value = withTiming(0, { duration: 300 });
    } else {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSequence(
        withSpring(1.1, { damping: 8 }),
        withSpring(1, { damping: 8 })
      );
    }
  }, [color]);

  useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.15, { damping: 6 });
    } else {
      scale.value = withSpring(1, { damping: 8 });
    }
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  if (color === -1) return <Animated.View style={[styles.cell, { width: size, height: size }]} />;

  const cowData = COW_COLORS[color % COW_COLORS.length];

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.cell,
          {
            width: size,
            height: size,
            backgroundColor: cowData.bg,
            borderColor: isSelected ? '#fff' : cowData.shadow,
            borderWidth: isSelected ? 3 : 2,
          },
          animatedStyle,
        ]}
      >
        <Text style={[styles.emoji, { fontSize: size * 0.5 }]}>{cowData.emoji}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    margin: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  emoji: {
    fontWeight: 'bold',
  },
});

export default CowCell;