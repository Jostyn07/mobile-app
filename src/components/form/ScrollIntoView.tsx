import { createContext, useContext, useEffect, useRef, useState, type ComponentRef, type ReactNode, type RefObject } from 'react';
import { Keyboard, Platform, ScrollView, View } from 'react-native';

// Permite que un campo dentro de un ScrollView pida "súbeme" al enfocarse,
// para que quede arriba con sus sugerencias visibles sobre el teclado.
export type ViewRef = ComponentRef<typeof View>;
type ScrollFn = (target: RefObject<ViewRef | null>) => void;

const ScrollIntoViewContext = createContext<ScrollFn>(() => {});

export function useScrollIntoView(): ScrollFn {
  return useContext(ScrollIntoViewContext);
}

const TOP_GAP = 12;

export function useScrollIntoViewHost() {
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const contentRef = useRef<ViewRef>(null);

  const scrollTo: ScrollFn = (target) => {
    // Espera a que el teclado empiece a abrir y el contenido se acomode.
    setTimeout(() => {
      const node = target.current;
      const content = contentRef.current;
      if (!node || !content) return;
      node.measureLayout(
        content,
        (_x: number, y: number) => scrollRef.current?.scrollTo({ y: Math.max(0, y - TOP_GAP), animated: true }),
        () => {},
      );
    }, Platform.OS === 'android' ? 250 : 100);
  };

  return { scrollRef, contentRef, scrollTo };
}

export function ScrollIntoViewProvider({ value, children }: { value: ScrollFn; children: ReactNode }) {
  return <ScrollIntoViewContext.Provider value={value}>{children}</ScrollIntoViewContext.Provider>;
}

// true mientras el teclado está abierto (para ocultar el botón inferior y ganar espacio).
export function useKeyboardVisible(): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setVisible(true));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return visible;
}