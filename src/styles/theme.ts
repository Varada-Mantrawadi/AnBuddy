export const lightTheme = {
  colors: {
    primary: '#7E57C2',
    secondary: '#AB47BC',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: {
      primary: '#333333',
      secondary: '#666666',
      onPrimary: '#FFFFFF',
    },
    border: '#E0E0E0',
    shadow: '#000000',
    chat: {
      userBubble: '#7E57C2',
      botBubble: '#FFFFFF',
      userText: '#FFFFFF',
      botText: '#333333',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 5,
    md: 10,
    lg: 20,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
      lineHeight: 22,
    },
    button: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  },
};

export const darkTheme = {
  colors: {
    primary: '#9575CD',
    secondary: '#CE93D8',
    background: '#121212',
    surface: '#1E1E1E',
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
      onPrimary: '#FFFFFF',
    },
    border: '#2C2C2C',
    shadow: '#000000',
    chat: {
      userBubble: '#9575CD',
      botBubble: '#2C2C2C',
      userText: '#FFFFFF',
      botText: '#FFFFFF',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 5,
    md: 10,
    lg: 20,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
      lineHeight: 22,
    },
    button: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  },
};

export type Theme = typeof lightTheme; 