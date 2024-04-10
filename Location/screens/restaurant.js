import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, PanResponder, StyleSheet, TouchableHighlight, ScrollView, ImageBackground, Dimensions, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Foundation';
import Icon3 from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';

const styles2 = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  matchesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'top',
    marginBottom: 200,
  },
  matchesHeaderText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
  },
  matchesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  matchesCard: {
    width: 150,
    height: 200,
    backgroundColor: '#6C009A',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    shadowColor: '#FFFD54',
    shadowOffset: { width: -5, height: -5 },
    shadowOpacity: 20,
    shadowRadius: 0,
    elevation: 8,
    marginTop:20, 
    marginBottom:40, 
  },
  cardImage: {
    height: 150,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
  },
  cardText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  },
  linearGradient2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#6C009A',
    width: 150,
    height: 50,
  },
  linearGradient3: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#6C009A',
    width: 120,
    height: 30,
    marginTop:10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  logo: {
    height: 70,
    width: 70,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  animatedCard: {
    width: 280,
    height: 380,
    backgroundColor: '#6C009A',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    shadowColor: '#FFFD54',
    shadowOffset: { width: -5, height: -5 },
    shadowOpacity: 20,
    shadowRadius: 0,
    elevation: 8,
  },
  cardImage: {
    height: 300,
    width: 250,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    marginVertical: 10,
  },
  cardTextLeft: {
    position: 'absolute',
    bottom: 5,
    left: 20,
    alignItems: 'flex-start',
  },
  cardTextRight: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    alignItems: 'flex-end',
  },
  exhaustedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  exhaustedText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#6C009A',
    padding: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 18,
    marginRight: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  actionButton: {
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    shadowColor: '#FFFD54',
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 20,
    shadowRadius: 0,
    elevation: 8,
  },
  matchesButton: {
    flexDirection: 'row',
    marginBottom: 60,
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const styles3 = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerWrapper: {
    height: '40%',
  },
  wrapper: {height: height * 0.1,},
  carouselImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    height: '100%',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '75%',
    backgroundColor: 'white',
    padding: 10,
    borderTopLeftRadius: 20,
  },
  titleText: {
    fontWeight: 'bold',
  },
  favoriteIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
  },
  infoContainer: {
    padding: 20,
  },
  categoryContainer: {
    borderRadius: 8,
    padding: 8,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold'
  },
  ratingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  ratingContainer: {
    borderRadius: 8,
    padding: 10,
  },
  ratingText: {
    fontSize: 16,
    color: 'white'
  },
  priceContainer: {
    marginVertical: 10,
  },
  priceText: {
    fontSize: 16,
    color: 'white',
  },
  ratingInfoContainer: {
    flexDirection: 'row',
  },
  starsContainer: {
  },
  starsText: {
    fontSize: 16,
    color: 'white',
  },
  verticalDivider: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  reviewsText: {
    fontSize: 16,
    color: 'white',
  },
  gradiente: {
    flex: 1,
  },
  gradiente2: {
    flex: 1,
    borderRadius: 8,
  },
  paginationStyle: {
    position: 'absolute',
    left: 10,
    bottom: 10,
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 300,
  },

  activeDot: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 300,
  },
  starIcon2: {
    marginRight: 10,
  },
  address: {
    marginTop: 10,
    color:'white',
  },
  googleMapsButton: {
    marginTop: 10,
    marginBottom: 150,
    alignItems: 'center',
  },

  googleMapsButtonGradient: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  googleMapsButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  bottomT: {
    paddingBottom:100,
  }
});

const mapPriceLevelToSymbol = (priceLevel) => {
    switch (priceLevel) {
      case 0:
        return '$';
      case 1:
        return '$';
      case 2:
        return '$$';
      case 3:
        return '$$$';
      case 4:
        return '$$$$';
      default:
        return 'Consultar';
    }
  };

const TinderScreen = ({navigation}) => {
  const [matches, setMatches] = useState(0);
  const animatedValueX = new Animated.Value(0);
  const [venueQueue, setVenueQueue] = useState([]);
  const [venueData, setVenueData] = useState(null);
  const [venuesExhausted, setVenuesExhausted] = useState(false);
  const [likePressed, setLikePressed] = useState('white');
  const [dislikePressed, setDislikePressed] = useState(false);
  const [displayedVenues, setDisplayedVenues] = useState([]);
  const [allVenuesExhausted, setAllVenuesExhausted] = useState(false);
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [count,setCount] = useState([]);

  const fetchVenues = async () => {
    try {
      const tiposPermitidos2 = [
        {
          "category_id": 13018,
          "category_label": "Dining and Drinking > Bar > Pub"
        }
      ];

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissão de localização não concedida');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'fsq3FBZjdvKpF/IIZRhlr6zp4+4ZER3PyGVaDHQ6otH6n3k='
        }
      };

      const raio = 8000;

      const requests = tiposPermitidos2.map(async (tipo) => {
        const response = await axios.get(`https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}&radius=${raio}&categories=${tipo.category_id}&fields=fsq_id,categories,geocodes,distance,location,price,photos,stats,rating,name,tips&limit=5`, options);

        const venueResults = response.data.results.map((venue) => ({
          name: venue.name,
          type: venue.categories[0].name,
          distancia: venue.distance,
          price: venue.price,
          rating: venue.rating || 'N/A', 
          address: venue.location.formatted_address,
          total_rating: venue.stats?.total_ratings || 'Rating não disponível',
          tip: venue.tips[0]?.text || 'Avaliação não disponível',
          photos: venue.photos && venue.photos.length > 0
            ? venue.photos.map(photo => `${photo.prefix}original${photo.suffix}`)
            : [`${venue.categories[0].icon.prefix}120${venue.categories[0].icon.suffix}`]
        }));

        const newVenues = venueResults.filter((venue) => !displayedVenues.includes(venue.name));

        if (newVenues.length === 0) {
          setAllVenuesExhausted(true);
        } else {
          setVenueQueue(newVenues);
          setVenueData(newVenues[0]);
          setDisplayedVenues((prevVenues) => [...prevVenues, ...newVenues.map((newVenue) => newVenue.name)]);
          setAllVenuesExhausted(false);
        }
      });

      await Promise.all(requests);
    } catch (error) {
      console.error('Erro ao buscar locais:', error);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: animatedValueX }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 120) {
          handleSwipeRight();
        } else if (gestureState.dx < -120) {
          handleSwipeLeft();
        } else {
          Animated.timing(animatedValueX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleSwipeRight = () => {
    setLikePressed('#00EA95')
    Animated.timing(animatedValueX, {
      toValue: 600,
      duration: 400,
      useNativeDriver: false,
    }).start(async () => {
      animatedValueX.setValue(0);
      setMatches(matches + 1);
    
      setVenueQueue((prevQueue) => prevQueue.slice(1));
      const selectedVenue = venueQueue[0];

      try {
        const firestore = firebase.firestore();
        const user = firebase.auth().currentUser;

        if (user) {
          const userDocRef = firestore.collection('usuários').doc(user.uid);
          await userDocRef.update({
            selectedVenues: firebase.firestore.FieldValue.arrayUnion(selectedVenue),
          });
          const userDoc = await userDocRef.get();
          const userMatches = userDoc.data()?.selectedVenues || [];
          setCount(userMatches)
        }
      } catch (error) {
        console.error('Erro ao enviar informações para o Firestore:', error);
      }


      setSelectedVenues((prevVenues) => [...prevVenues, selectedVenue]);
      if (venueQueue.length > 1) {
        setVenueData(venueQueue[1]);
      } else {
        setVenuesExhausted(true);
      }
    });
  };

  const handleSwipeLeft = () => {
    setLikePressed('#00EA95')
    Animated.timing(animatedValueX, {
      toValue: -600,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      animatedValueX.setValue(0);

      setVenueQueue((prevQueue) => prevQueue.slice(1));
      if (venueQueue.length > 1) {
        setVenueData(venueQueue[1]);
      } else {
        setVenuesExhausted(true);
      }
    });
  };

  const handleUpdate = () => {
    if (allVenuesExhausted) {
      setDisplayedVenues([]);
    }
    fetchVenues();
  };

  return (
    <LinearGradient
      colors={['#00EA95', '#B01EEE']}
      style={styles.linearGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../img/LOGO.png')} />
      </View>
      <View style={styles.cardContainer}>
        {!venuesExhausted ? (
          <Animated.View
            style={{
              transform: [{ translateX: animatedValueX }],
            }}
            {...panResponder.panHandlers}
          >
            <View style={styles.animatedCard}>
              <Image style={styles.cardImage} source={{ uri: venueData?.photos[0] }} />
              <View style={styles.cardTextLeft}>
                <Text style={{ color: 'white', fontSize: 18, marginBottom: 5 }}>{venueData?.name}</Text>
                <Text style={{ fontSize: 16, color: 'white', marginBottom: 5 }}>{venueData?.type}</Text>
              </View>
              <View style={styles.cardTextRight}>
                <Text style={{ fontSize: 14, color: 'white' }}>Preço: {mapPriceLevelToSymbol(venueData?.price)}</Text>
                <Text style={{ color: 'white', fontSize: 12 }}>Avaliação: {venueData?.rating}/10</Text>
              </View>
            </View>
          </Animated.View>
        ) : (
          <View style={styles.exhaustedContainer}>
            <Text style={styles.exhaustedText}>
              Parece que os estabelecimentos próximos a você se esgotaram :(
            </Text>
            <TouchableOpacity onPress={handleUpdate} style={styles.refreshButton} >
              <Text style={styles.refreshButtonText}>Atualizar</Text>
              <Icon name={'refresh'} size={15} style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}

        {!venuesExhausted && (
          <View style={styles.actionButtons}>
            <TouchableHighlight onPress={handleSwipeLeft} style={[styles.actionButton, { backgroundColor: '#6C009A' }]} underlayColor="#FFDB00">
              <Icon2 name={'dislike'} size={60} style={`color: ${likePressed}`} />
            </TouchableHighlight>
            <View style={{ marginHorizontal: 50, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
            </View>
            <TouchableHighlight onPress={handleSwipeRight} style={[styles.actionButton, { backgroundColor: '#6C009A' }]} underlayColor="#FFDB00">
              <Icon2 name={'like'} size={60} style={`color: ${likePressed}`} />
            </TouchableHighlight>
          </View>
        )}

        <TouchableHighlight
          onPress={async () => {
            try {
              const firestore = firebase.firestore();
              const user = firebase.auth().currentUser;

              if (user) {
                const userDocRef = firestore.collection('usuários').doc(user.uid);
                const userDoc = await userDocRef.get();

                const userMatches = userDoc.data()?.selectedVenues || [];
                navigation.navigate('Matches', { matchesCount: userMatches.length, userMatches });
              }
            } catch (error) {
              console.error('Erro ao buscar informações do Firestore:', error);
            }
          }}
          style={styles.matchesButton}
        >
          <LinearGradient colors={['#00EA95', '#B01EEE']} style={styles.linearGradient2} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={{ color: 'white', fontSize: 15 }}>{`Matchs`}</Text>
          </LinearGradient>
        </TouchableHighlight>

      </View>
    </LinearGradient>
  );
};


const MatchesScreen = ({ route, navigation }) => {
  const { matchesCount, userMatches } = route.params;
  const [venueSelected, setVenueSelected] = useState(null);
  const [visibleMatches, setVisibleMatches] = useState(userMatches);

  const handleVenueLongPress = async (index) => {
    const shouldDelete = await showDeleteConfirmation();

    if (shouldDelete) {
      const venueIdToDelete = userMatches[index];

      const firestore = firebase.firestore();
      const user = firebase.auth().currentUser;

      if (user) {
        await firestore.collection('usuários').doc(user.uid).update({
          selectedVenues: firebase.firestore.FieldValue.arrayRemove(venueIdToDelete),
        });
      }
      
      const updatedMatches = [...userMatches];
      updatedMatches.splice(index, 1);
      userMatches.splice(index, 1);
      setVisibleMatches(updatedMatches);
    }
  };

  const handleVenuePress = (index) => {
    setVenueSelected(index);
    navigation.navigate('Detalhes', { selectedVenue: userMatches[index] });
  };

  const showDeleteConfirmation = () => {
    return new Promise((resolve) => {
      resolve(true);
    });
  };

  return (
    <LinearGradient
      colors={['#00EA95', '#B01EEE']}
      style={styles.linearGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView>
        <View style={styles2.matchesContainer}>
          <View style={styles2.matchesRow}>
            {visibleMatches.map((venue, index) => (
              <LongPressGestureHandler
                key={index}
                onHandlerStateChange={({ nativeEvent }) => {
                  if (nativeEvent.state === State.ACTIVE) {
                    handleVenueLongPress(index);
                  }
                }}
              >
                <TouchableOpacity onPress={() => handleVenuePress(index)}>
                  <View style={styles2.matchesCard}>
                    <Image style={styles2.cardImage} source={{ uri: venue.photos[0] }} />
                    <Text style={{ color: 'white', fontSize: 15, marginBottom: 5 }}>{venue.name}</Text>
                    <TouchableOpacity onPress={() => handleVenueLongPress(index)}>
                      <LinearGradient colors={['#00EA95', '#B01EEE']} style={styles.linearGradient3} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                        <Text style={{ color: 'white', fontSize: 15 }}>{`Apagar`}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </LongPressGestureHandler>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};


const { height } = Dimensions.get('window');

const DetalhesRestauranteScreen = ({ navigation, route }) => {
  const selectedVenue = route.params;
  const restaurantName = selectedVenue.selectedVenue.name;
  const restauranteRating = selectedVenue.selectedVenue.rating;
  const restauranteType = selectedVenue.selectedVenue.type;
  const restaurantePrice = selectedVenue.selectedVenue.price;
  const restaurantAddress = selectedVenue.selectedVenue.address;
  const restauranteRatings = selectedVenue.selectedVenue.total_rating;
  const restaurantePhotos = selectedVenue.selectedVenue.photos;
  const restauranteTip = selectedVenue.selectedVenue.tip;
  const [photoUrls, setPhotoUrls] = useState([]);
  const [isFavorited, setFavorited] = useState(false);
  const [relevantReview, setRelevantReview] = useState(null);

  const openGoogleMaps = () => {
    const address = encodeURIComponent(restaurantAddress);
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    Linking.openURL(url);
  };

  function mapPriceLevelToSymbol(priceLevel) {
    switch (priceLevel) {
      case 0:
        return '$';
      case 1:
        return '$';
      case 2:
        return '$$';
      case 3:
        return '$$$';
      case 4:
        return '$$$$';
      default:
        return 'Consultar';
    }}

  return (
    <LinearGradient
      colors={['#00EA95', '#B01EEE']}
      style={styles3.gradiente}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
    <ScrollView>
      <View style={styles3.container}>
        <View style={styles3.containerWrapper}>
          <Swiper
            style={styles3.wrapper}
            loop={true}
            height={height * 0.4}
            dotStyle={styles3.dot}
            activeDotStyle={styles3.activeDot}
            paginationStyle={styles3.paginationStyle}
          >
            {restaurantePhotos.map((prefixo, index) => (
              <ImageBackground
                source={{ uri: `${prefixo}` }}
                style={styles3.carouselImage}
                imageStyle={styles3.imageBackground}
              >
                <View style={styles3.titleContainer}>
                  <Text style={styles3.titleText}>{restaurantName}</Text>
                </View>
                <TouchableOpacity
                  style={styles3.favoriteIconContainer}
                  onPress={() => setFavorited(!isFavorited)}
                >
                  <Icon
                    name={isFavorited ? 'heart' : 'heart-outline'}
                    size={35}
                    color={isFavorited ? 'black' : 'white'}
                  />
                </TouchableOpacity>
              </ImageBackground>
            ))}
          </Swiper>
        </View>

        <View style={styles3.infoContainer}>
          <View style={styles3.categoryContainer}>
            <Text style={styles3.categoryText}>{restauranteType}</Text>
          </View>
          <View style={styles3.divider} />
        <LinearGradient
            colors={['#6C009A', '#9A0081']}
            style={styles3.gradiente2}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
          <View style={styles3.ratingContainer}>
            <Text style={styles3.ratingText}>{restauranteTip}</Text>
          </View>
        </LinearGradient>
          <View style={styles3.priceContainer}>
            <Text style={styles3.priceText}>{`Preço: ${mapPriceLevelToSymbol(restaurantePrice)}`}</Text>
          </View>
          <View style={styles3.ratingInfoContainer}>
            <View style={styles3.starsContainer}>
              <FontAwesomeIcon name="star" size={20} color="white" style={styles3.starIcon2} />
            </View>
            <View style={styles3.ratingTextContainer}>
              <Text style={styles3.starsText}>{restauranteRating}</Text>
            </View>
            <Text style={styles3.verticalDivider}>|</Text>
            <Text style={styles3.reviewsText}>{restauranteRatings} avaliações</Text>
          </View>
          <Text style={styles3.address}>{restaurantAddress}</Text>
          <View style={styles3.container}>
            <TouchableOpacity onPress={openGoogleMaps} style={styles3.googleMapsButton}>
              <LinearGradient
                colors={['#ffdb00', '#FFDB00']}
                style={styles3.googleMapsButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <Text style={styles3.googleMapsButtonText}>Abrir no Google Maps</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles3.bottomT}></Text>
          </View>
        </View>
      </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default function Main() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Tinder" screenOptions={{ title: 'Surpreenda-me', headerTitleStyle: {color: 'white', fontSize: 20},headerStyle: { backgroundColor: '#6C009A', color: 'white' }}}>
        <Stack.Screen name="Tinder" component={TinderScreen} />
        <Stack.Screen name="Matches" component={MatchesScreen} />
        <Stack.Screen name="Detalhes" component={DetalhesRestauranteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



