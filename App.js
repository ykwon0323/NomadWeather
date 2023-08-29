import { StatusBar } from 'expo-status-bar';
import { ScrollView, ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons'; 


// ES6 문법 객체안에서 width속성 값을 가져오고 이름을 SCREEN_WIDTH로 지정해주는 문법
const { width:SCREEN_WIDHT } = Dimensions.get("window");


const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "",
  Snow: "snow",
  Rain: "rain",
  Drizzle: "rains",
  Thunderstorm: "lightning",
  
}

export default function App() {

  const [city, setCity] = useState("...loading");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const ask = async() =>{
    const {granted} = await Location.requestForegroundPermissionsAsync();
    
    if (!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5})
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});

    setCity(location[0].city)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alert&appid=${API_KEY}&units=matric`);
    console.log(response)
    const json = await response.json();
    console.log(json.daily)
    setDays(json.daily)

  }
  useEffect(() => {
    ask();
  })

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView style={styles.weather} 
                  horizontal 
                  contentContainerStyle={styles.weather}
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  >
        {days == null ? (<View style={styles.day}>
                                <ActivityIndicator color="white" style={{marginTop: 10}} size="large"/>
                            </View>)
                           : (
                              days.map((day, index) =>
                                  <View key={index} style={styles.day}>
                                    <View style={{flexDirection: "row", 
                                                  alignItems: "center", 
                                                  width: "100%",
                                                  justifyContent: "space-between"}}>
                                      <Text style={styles.temp}>
                                        {parseFloat(day.temp.day).toFixed(1)}
                                      </Text>
                                      <Fontisto name={icons[day.weather[0].main]} size={68} color="black" />
                                    </View>
                                    <Text style={styles.description}>{day.weather[0].main}</Text>
                                    <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                                  </View>)
                              )
                           }
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3c82d',
  },
  city:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  cityName:{
    fontSize: 68,
    fontWeight: '500'
  },
  weather:{
    
  },
  day:{
    width: SCREEN_WIDHT,
    alignItems: 'center'
  },
  temp:{
    marginTop: 50,
    fontSize: 168,
  },
  description:{
    marginTop: -30,
    fontSize: 60,
  },
  tinyText:{
    fontSize: 20,
  }
});
