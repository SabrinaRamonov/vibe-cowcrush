import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
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
  const beamOpacity = useSharedValue(0);
  const beamHeight = useSharedValue(0);

  useEffect(() => {
    if (cells.length > 0) {
      // Trigger haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // UFO appears
      ufoOpacity.value = withTiming(1, { duration: 200 });

      // Beam shoots down
      setTimeout(() => {
        beamOpacity.value = withTiming(0.8, { duration: 300 });
        beamHeight.value = withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
        });
      }, 200);

      // Beam retracts and UFO leaves
      setTimeout(() => {
        beamHeight.value = withTiming(0, { duration: 300 });
        beamOpacity.value = withTiming(0, { duration: 300 });
        ufoOpacity.value = withTiming(0, { duration: 300 });
      }, 700);
    }
  }, [cells]);

  const ufoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: ufoOpacity.value,
  }));

  const beamAnimatedStyle = useAnimatedStyle(() => ({
    opacity: beamOpacity.value,
    height: beamHeight.value * (boardSize * cellSize),
  }));

  if (cells.length === 0) return null;

  // Calculate center position of matched cells
  const avgRow = cells.reduce((sum, cell) => sum + cell.row, 0) / cells.length;
  const avgCol = cells.reduce((sum, cell) => sum + cell.col, 0) / cells.length;

  const beamX = avgCol * cellSize + cellSize / 2;

  return (
    <>
      {/* UFO */}
      <Animated.View
        style={[
          styles.ufo,
          {
            left: beamX - 30,
            top: -60,
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
        </View>
      </Animated.View>

      {/* Beam */}
      <Animated.View
        style={[
          styles.beam,
          {
            left: beamX - 20,
            top: -20,
          },
          beamAnimatedStyle,
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  ufo: {
    position: 'absolute',
    width: 60,
    height: 40,
  },
  ufoBody: {
    width: 60,
    height: 40,
    alignItems: 'center',
  },
  ufoDome: {
    width: 30,
    height: 20,
    backgroundColor: '#00ffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    top: 0,
    opacity: 0.8,
  },
  ufoBase: {
    width: 60,
    height: 15,
    backgroundColor: '#7700ff',
    borderRadius: 30,
    position: 'absolute',
    top: 15,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  ufoLight1: {
    width: 6,
    height: 6,
    backgroundColor: '#ffff00',
    borderRadius: 3,
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  ufoLight2: {
    width: 6,
    height: 6,
    backgroundColor: '#ff00ff',
    borderRadius: 3,
    position: 'absolute',
    bottom: 10,
    left: 27,
  },
  ufoLight3: {
    width: 6,
    height: 6,
    backgroundColor: '#00ffff',
    borderRadius: 3,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  beam: {
    position: 'absolute',
    width: 40,
    backgroundColor: '#00ff88',
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

export default UFOAbduction;