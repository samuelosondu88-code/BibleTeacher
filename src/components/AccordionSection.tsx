import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
} from 'react-native';

interface Props {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SECTION_COLORS: Record<string, string> = {
  'Simple Meaning': '#d97706',
  'Original Language Insights': '#0f766e',
  'Historical & Biblical Context': '#7c3aed',
  'Life Application': '#059669',
};

export default function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const anim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;
  const color = SECTION_COLORS[title] || '#d97706';

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isOpen, anim]);

  const bodyHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2000],
  });

  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.container, isOpen && styles.containerOpen]}>
      <TouchableOpacity
        style={[styles.header, { borderLeftColor: color }]}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}>
        <View style={[styles.iconWrap, { backgroundColor: color + '15' }]}>
          <Text style={[styles.icon, { color }]}>{icon}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Animated.Text
          style={[styles.arrow, { color, transform: [{ rotate }] }]}>
          ▼
        </Animated.Text>
      </TouchableOpacity>
      <Animated.View
        style={[styles.body, { maxHeight: bodyHeight, opacity: anim }]}>
        <ScrollView
          style={styles.scrollBody}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>{children}</View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  containerOpen: {
    borderColor: '#9ca3af',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderLeftWidth: 3,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 17,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1917',
    flex: 1,
  },
  arrow: {
    fontSize: 10,
    fontWeight: '700',
  },
  body: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  scrollBody: {
    maxHeight: 2000,
  },
  content: {
    padding: 16,
    paddingTop: 12,
  },
});
