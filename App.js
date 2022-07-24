import { StatusBar } from 'expo-status-bar';
import React, {useCallback, useMemo, useRef, useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { Platform, StyleSheet, Text, View, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {locations} from './source/Data'
import CustomMarker from './source/components/CustomMarker'
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Location from 'expo-location';

export default function App() {

  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const snapPoints = ['25%', '40%'];
  const [location, setLocation] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    console.log(location)
  }

  return (
    <View style={styles.container}>
      <MapView.Animated style={styles.map}
      provider={PROVIDER_GOOGLE}
      showsUserLocation
      initialRegion = {{ 
        latitude: 33.639935,
        longitude: 72.9158337,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      >
      
      {
        locations.map(marker => (
          <Marker
            coordinate = {{latitude: marker.latitude,
            longitude: marker.longitude}}
          >
          <CustomMarker item = {marker} />
            <Callout>
              
            </Callout>
          </Marker>
        ))
      }
    </MapView.Animated>

      <BottomSheet
          ref = {sheetRef}
          snapPoints = {snapPoints}
          enablePanDownToClose={true}
          onClose={() => setIsOpen(false)}
      >
        <BottomSheetView>
          <Text>hello</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width-50,
    height: Dimensions.get('window').height-80,
  },
});