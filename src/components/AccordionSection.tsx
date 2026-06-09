import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';

interface Props {
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const animHeight = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animHeight, {
      toValue: isOpen ? 1 : 0,
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [isOpen, animHeight]);

  const bodyHeight = animHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 600],
  });

  const rotateArrow = animHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View
      style={[
        styles.container,
        isOpen && styles.containerOpen,
      ]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={styles.title}>{title}</Text>
        <Animated.Text
          style={[styles.arrow, { transform: [{ rotate: rotateArrow }] }]}>
          ›
        </Animated.Text>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.body,
          { maxHeight: bodyHeight, opacity: animHeight },
        ]}>
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e8dfc8',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  containerOpen: {
    borderColor: '#e2c97e',
    shadowColor: '#c9a84c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  icon: {
    fontSize: 18,
    color: '#c9a84c',
    width: 24,
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2744',
    flex: 1,
  },
  arrow: {
    fontSize: 22,
    color: '#c9a84c',
    fontWeight: '300',
  },
  body: {
    borderTopWidth: 1,
    borderTopColor: '#f0e8d4',
  },
  content: {
    padding: 16,
  },
});
