import React from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  step: string;
}

export default function LoadingModal({ visible, step }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.cross}>✝</Text>
          <Text style={styles.title}>Studying the Scriptures…</Text>
          <View style={styles.bar}>
            <ActivityIndicator size="small" color="#c9a84c" />
          </View>
          <Text style={styles.step}>{step}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26,39,68,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  cross: {
    fontSize: 40,
    color: '#c9a84c',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '600',
    color: '#1a2744',
    marginBottom: 24,
  },
  bar: {
    marginBottom: 16,
  },
  step: {
    fontSize: 14,
    color: '#7a6a52',
    fontStyle: 'italic',
  },
});
