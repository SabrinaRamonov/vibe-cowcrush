import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const COW_COLORS = [
  { emoji: '🐄', bg: '#ff6b6b', shadow: '#c92a2a', glow: '#ff9999' }, // Red
  { emoji: '🐮', bg: '#4ecdc4', shadow: '#0a9699', glow: '#7efff7' }, // Cyan
  { emoji: '🐄', bg: '#ffe66d', shadow: '#f0b429', glow: '#fff5a0' }, // Yellow
  { emoji: '🐮', bg: '#a8e6cf', shadow: '#56ab91', glow: '#d4ffed' }, // Green
  { emoji: '🐄', bg: '#ff8b94', shadow: '#c95d63', glow: '#ffb8c0' }, // Pink
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
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (color === -1) {
      opacity.value = withTiming(0, { duration: 300 });
    } else {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSequence(
        withSpring(1.15, { damping: 6 }),
        withSpring(1, { damping: 8 })
      );
      rotation.value = withSequence(
        withSpring(5, { damping: 8 }),
        withSpring(-5, { damping: 8 }),
        withSpring(0, { damping: 8 })
      );
    }
  }, [color]);

  useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.2, { damping: 5 });
      rotation.value = withSequence(
        withSpring(-10, { damping: 6 }),
        withSpring(10, { damping: 6 }),
        withSpring(-10, { damping: 6 }),
        withSpring(0, { damping: 6 })
      );
    } else {
      scale.value = withSpring(1, { damping: 8 });
      rotation.value = withSpring(0, { damping: 8 });
    }
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
            borderWidth: isSelected ? 4 : 2,
            shadowColor: isSelected ? cowData.glow : cowData.shadow,
            shadowOpacity: isSelected ? 0.8 : 0.3,
            shadowRadius: isSelected ? 8 : 3,
          },
          animatedStyle,
        ]}
      >
        <View style={styles.cowContainer}>
          <Text style={[styles.emoji, { fontSize: size * 0.65 }]}>{cowData.emoji}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    margin: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  cowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default CowCell;