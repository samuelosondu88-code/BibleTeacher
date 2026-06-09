import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface Props {
  lines?: number;
}

export default function SkeletonLoader({ lines = 3 }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const widths = [90, 75, 60];

  return (
    <View style={styles.container}>
      {Array.from({ length: lines }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.line,
            {
              width: `${widths[i] || 50}%`,
              opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  line: {
    height: 14,
    backgroundColor: '#e0d8c8',
    borderRadius: 4,
  },
});
