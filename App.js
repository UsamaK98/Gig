import React, {useCallback, useMemo, useRef, useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { Pressable, StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import {locations} from './source/Data'
import CustomMarker from './source/components/CustomMarker'
import * as Location from 'expo-location';
import { BottomSheet } from 'react-native-btr';

//import to show social icons
import { SocialIcon } from 'react-native-elements';

let LATITUDE= 33.639935
let LONGITUDE= 72.9158337
let LATITUDE_DELTA= 0.0922
let LONGITUDE_DELTA= 0.0421

//How to get Lat and Long of corners of screen 
/* {
  latlng: {
      latitude: REGION.latitude+(REGION.latitudeDelta/2),
      longitude: REGION.longitude-(REGION.longitudeDelta/2)
  },
  title:'topLeft'

},
{
  latlng: {
      latitude: REGION.latitude-(REGION.latitudeDelta/2),
      longitude: REGION.longitude+(REGION.longitudeDelta/2)
  },
  title:'bottomRight'

} */

export default function App() {

  const [visible, setVisible] = useState(false);

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setPin()
    setVisible(!visible);
  };

  const modalRef = useRef(null);
  //const snapPoints = useMemo(() => ['25%', '50%'], []);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  var [pin, setPin] = useState('undefined');

  

  const onOpen = () => {
    modalRef.current?.open();
  };

  const onClose = () => {
    modalRef.current?.close();
  };
 
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

  showHeader = () => (
    <View style={styles.panelHeader}>
      <View style={styles.modalHeader}>
        <View style={styles.panelHandle} />
        <Text style={styles.modalHeaderText}>
          Swipe down to close the modal
        </Text>
      </View>
    </View>
  );
  showContent = () => (
    <>
      <View style={styles.panel}>
        <Text style={{ marginBottom: 10 }}>
          Hello World!
        </Text>
      </View>
    </>
  );
  
  return (
    
    <View style={styles.container}>
      <MapView.Animated style={styles.map}
      provider={PROVIDER_GOOGLE}
      showsUserLocation
      >
      
      {
        locations.map(marker => (
          <Marker
            coordinate = {{latitude: marker.latitude,
            longitude: marker.longitude}}
            onPress={toggleBottomNavigationView}
            setPin = {
              pin = marker.title
            }
          >
          

          <CustomMarker item = {marker}/>
            <Callout>
              <Text>Hello</Text>
            </Callout>
          </Marker>
        ))
      }
    </MapView.Animated>

    <Button
          onPress={toggleBottomNavigationView}
          title="Show Bottom Sheet"
        />
        <BottomSheet
          visible={visible}
          onBackButtonPress={toggleBottomNavigationView}
          onBackdropPress={toggleBottomNavigationView}
        >
        <View style={styles.container}>
          <Text>{pin}</Text>
        </View>
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
