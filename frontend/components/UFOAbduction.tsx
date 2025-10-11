import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface UFOAbductionProps {
  cells: { row: number; col: number }[];
  cellSize: number;
  boardSize: number;
}

const UFOAbduction: React.FC<UFOAbductionProps> = ({ cells, cellSize, boardSize }) => {
  const ufoOpacity = useSharedValue(0);
  const ufoY = useSharedValue(-80);
  const beamOpacity = useSharedValue(0);
  const beamHeight = useSharedValue(0);
  const cowsOpacity = useSharedValue(1);
  const cowsY = useSharedValue(0);

  useEffect(() => {
    if (cells.length > 0) {
      // Trigger haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Reset values
      ufoOpacity.value = 0;
      ufoY.value = -80;
      beamOpacity.value = 0;
      beamHeight.value = 0;
      cowsOpacity.value = 1;
      cowsY.value = 0;

      // UFO appears and comes down
      ufoOpacity.value = withTiming(1, { duration: 200 });
      ufoY.value = withTiming(-60, { duration: 400, easing: Easing.out(Easing.quad) });

      // Beam shoots down
      setTimeout(() => {
        beamOpacity.value = withTiming(0.9, { duration: 250 });
        beamHeight.value = withTiming(1, {
          duration: 350,
          easing: Easing.out(Easing.cubic),
        });
      }, 300);

      // Cows get lifted up into UFO
      setTimeout(() => {
        cowsY.value = withTiming(-200, { duration: 600, easing: Easing.in(Easing.quad) });
        cowsOpacity.value = withDelay(400, withTiming(0, { duration: 200 }));
        
        // Stronger haptic when cows are lifted
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }, 600);

      // Beam retracts and UFO leaves
      setTimeout(() => {
        beamHeight.value = withTiming(0, { duration: 250 });
        beamOpacity.value = withTiming(0, { duration: 250 });
        ufoY.value = withTiming(-150, { duration: 400, easing: Easing.in(Easing.quad) });
        ufoOpacity.value = withDelay(200, withTiming(0, { duration: 200 }));
      }, 1200);
    }
  }, [cells]);

  const ufoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: ufoOpacity.value,
    transform: [{ translateY: ufoY.value }],
  }));

  const beamAnimatedStyle = useAnimatedStyle(() => ({
    opacity: beamOpacity.value,
    height: beamHeight.value * (boardSize * cellSize),
  }));

  const cowsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cowsOpacity.value,
    transform: [{ translateY: cowsY.value }],
  }));

  if (cells.length === 0) return null;

  // Calculate center position of matched cells
  const avgRow = cells.reduce((sum, cell) => sum + cell.row, 0) / cells.length;
  const avgCol = cells.reduce((sum, cell) => sum + cell.col, 0) / cells.length;

  const beamX = avgCol * cellSize + cellSize / 2;
  const cowsX = avgCol * cellSize;
  const cowsYPos = avgRow * cellSize;

  return (
    <>
      {/* UFO */}
      <Animated.View
        style={[
          styles.ufo,
          {
            left: beamX - 40,
            top: 0,
          },
          ufoAnimatedStyle,
        ]}
      >
        <View style={styles.ufoBody}>
          <View style={styles.ufoDome} />
          <View style={styles.ufoBase} />
          <View style={styles.ufoLight1} />
          <View style={styles.ufoLight2} />
          <View style={styles.ufoLight3} />
          <View style={styles.ufoGlow} />
        </View>
      </Animated.View>

      {/* Beam */}
      <Animated.View
        style={[
          styles.beam,
          {
            left: beamX - 25,
            top: -20,
          },
          beamAnimatedStyle,
        ]}
      >
        <View style={styles.beamInner} />
      </Animated.View>

      {/* Floating Cows being lifted */}
      {cells.map((cell, index) => (
        <Animated.View
          key={`cow-${cell.row}-${cell.col}-${index}`}
          style={[
            styles.floatingCow,
            {
              left: cell.col * cellSize + cellSize / 4,
              top: cell.row * cellSize + cellSize / 4,
            },
            cowsAnimatedStyle,
          ]}
        >
          <Text style={[styles.cowEmoji, { fontSize: cellSize * 0.5 }]}>🐄</Text>
        </Animated.View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  ufo: {
    position: 'absolute',
    width: 80,
    height: 50,
    zIndex: 1000,
  },
  ufoBody: {
    width: 80,
    height: 50,
    alignItems: 'center',
  },
  ufoDome: {
    width: 40,
    height: 25,
    backgroundColor: '#00ffff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    position: 'absolute',
    top: 0,
    opacity: 0.85,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  ufoBase: {
    width: 80,
    height: 20,
    backgroundColor: '#7700ff',
    borderRadius: 40,
    position: 'absolute',
    top: 20,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  ufoGlow: {
    width: 90,
    height: 30,
    backgroundColor: '#00ff88',
    borderRadius: 45,
    position: 'absolute',
    top: 18,
    opacity: 0.2,
  },
  ufoLight1: {
    width: 8,
    height: 8,
    backgroundColor: '#ffff00',
    borderRadius: 4,
    position: 'absolute',
    bottom: 15,
    left: 15,
    shadowColor: '#ffff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  ufoLight2: {
    width: 8,
    height: 8,
    backgroundColor: '#ff00ff',
    borderRadius: 4,
    position: 'absolute',
    bottom: 15,
    left: 36,
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  ufoLight3: {
    width: 8,
    height: 8,
    backgroundColor: '#00ffff',
    borderRadius: 4,
    position: 'absolute',
    bottom: 15,
    right: 15,
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  beam: {
    position: 'absolute',
    width: 50,
    backgroundColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    zIndex: 999,
  },
  beamInner: {
    flex: 1,
    backgroundColor: '#7efff7',
    opacity: 0.4,
    margin: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  floatingCow: {
    position: 'absolute',
    zIndex: 1001,
  },
  cowEmoji: {
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});

export default UFOAbduction;