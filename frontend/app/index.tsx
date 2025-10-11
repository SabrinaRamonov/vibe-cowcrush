import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameBoard from '../components/GameBoard';
import { useGameStore } from '../store/gameStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function Index() {
  const { score, moves, gameOver, resetGame } = useGameStore();
  const [bestScore, setBestScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  useEffect(() => {
    loadBestScore();
  }, []);

  useEffect(() => {
    if (gameOver) {
      setShowGameOver(true);
      if (score > bestScore) {
        setBestScore(score);
        saveBestScore(score);
      }
    }
  }, [gameOver]);

  const loadBestScore = async () => {
    try {
      const saved = await AsyncStorage.getItem('bestScore');
      if (saved) {
        setBestScore(parseInt(saved));
      }
    } catch (error) {
      console.error('Error loading best score:', error);
    }
  };

  const saveBestScore = async (newBest: number) => {
    try {
      await AsyncStorage.setItem('bestScore', newBest.toString());
    } catch (error) {
      console.error('Error saving best score:', error);
    }
  };

  const handleRestart = () => {
    setShowGameOver(false);
    resetGame();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🐄 COW ABDUCTION 🛸</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>MOVES</Text>
            <Text style={styles.statValue}>{moves}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>BEST</Text>
            <Text style={styles.statValue}>{bestScore}</Text>
          </View>
        </View>
      </View>

      {/* Game Board */}
      <GameBoard />

      {/* Restart Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
          <Text style={styles.restartButtonText}>🔄 NEW GAME</Text>
        </TouchableOpacity>
      </View>

      {/* Game Over Modal */}
      <Modal
        visible={showGameOver}
        transparent
        animationType="fade"
        onRequestClose={handleRestart}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🛸 GAME OVER 🛸</Text>
            <Text style={styles.modalSubtitle}>No more moves!</Text>
            
            <View style={styles.modalStats}>
              <View style={styles.modalStatRow}>
                <Text style={styles.modalStatLabel}>Final Score:</Text>
                <Text style={styles.modalStatValue}>{score}</Text>
              </View>
              <View style={styles.modalStatRow}>
                <Text style={styles.modalStatLabel}>Moves Made:</Text>
                <Text style={styles.modalStatValue}>{moves}</Text>
              </View>
              <View style={styles.modalStatRow}>
                <Text style={styles.modalStatLabel}>Best Score:</Text>
                <Text style={styles.modalStatValue}>{bestScore}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleRestart}
            >
              <Text style={styles.modalButtonText}>PLAY AGAIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statBox: {
    backgroundColor: '#1a2456',
    borderRadius: 12,
    padding: 12,
    minWidth: 90,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  statLabel: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  restartButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#fff',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a2456',
    borderRadius: 20,
    padding: 30,
    width: width * 0.85,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#00ff88',
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    color: '#ff6b35',
    marginBottom: 25,
  },
  modalStats: {
    width: '100%',
    marginBottom: 30,
  },
  modalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a3566',
  },
  modalStatLabel: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: '600',
  },
  modalStatValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#fff',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});