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
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>🕊</Text>
          </View>
          <Text style={styles.title}>Studying the Scriptures</Text>
          <View style={styles.divider} />
          <View style={styles.bar}>
            <ActivityIndicator size="small" color="#d97706" />
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
    backgroundColor: 'rgba(15,118,110,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 20,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0fdfa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 30,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1917',
    marginBottom: 4,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: '#d97706',
    borderRadius: 1,
    marginVertical: 12,
    marginBottom: 16,
  },
  bar: {
    marginBottom: 12,
  },
  step: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
