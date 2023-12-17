import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Navigation from './pages/navigation/Navigation';
import { Provider } from 'react-redux';
import store from './store';

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

const styles = StyleSheet.create({

});
