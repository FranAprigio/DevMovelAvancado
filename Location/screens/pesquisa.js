import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, ImageBackground, Dimensions, Linking } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Swiper from 'react-native-swiper';
import * as Location from 'expo-location';
import axios from 'axios';
import {LinearGradient} from 'expo-linear-gradient';
import firebase from 'firebase';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const RestaurantCard = ({ name, type, priceRange, rating, imageSource, onPress, userRatingsTotal, distancia }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.restaurantCard}>
      <Image source={{ uri: imageSource }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <Text style={styles.textRestaurant}>{name}</Text>
        <Text style={styles.textRestaurant}>{type}</Text>
        <Text style={styles.textRestaurant}>{`Distância: ${distancia} km`}</Text>
        <Text style={styles.textRestaurant}>Preço: {mapPriceLevelToSymbol(priceRange)}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <FontAwesomeIcon name="star" size={20} color="yellow" style={styles.starIcon} />
        <Text>{rating}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

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

const { height } = Dimensions.get('window');

function Pesquisa({navigation}) {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [indice, setIds] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [dados, setDados] = useState([]);

  const getPhotos = async (fsq_id) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'fsq3FBZjdvKpF/IIZRhlr6zp4+4ZER3PyGVaDHQ6otH6n3k='
      }
    };

    const url = `https://api.foursquare.com/v3/places/${fsq_id}?fields=photos%2Ctips%2Cprice%2Cstats%2Crating`;
    const resposta = await fetch(url, options);
    const dados = await resposta.json();
    if (dados.photos[0]) {
      const formattedPhotos = dados.photos.map(photo => `${photo.prefix}original${photo.suffix}`);
      const data = dados
      //`${dados[0].prefix}original${dados[0].suffix}`; 
      return [formattedPhotos, data]

    } else {
      return null;
    }
    
  };

  const handleSearch = async () => {
    try {
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
        try {
          const url = `https://api.foursquare.com/v3/autocomplete?query=${searchText}&ll=${latitude}%2C${longitude}`;
          const resposta = await fetch(url, options);
          const dados = await resposta.json();
          const places = dados.results.filter(item => item.type === "place").map(item => item.text);
          const ids = dados.results.filter(item=>item.type === "place").map(item=>item.place);
          const final_places = places.map(item=>item.primary)
          setLoadingImages(true);
          const imagesPromises = ids.map(async (estabelecimento) => {
            const photoUrl = await getPhotos(estabelecimento.fsq_id);
            return {
              ...estabelecimento,
              photoUrl: photoUrl ? photoUrl[0] || `${estabelecimento.categories[0].icon.prefix}120${estabelecimento.categories[0].icon.suffix}` : `${estabelecimento.categories[0].icon.prefix}120${estabelecimento.categories[0].icon.suffix}`,
              data: photoUrl ? photoUrl[1] : null,
            };
          });

          const updatedIds = await Promise.all(imagesPromises);

          setSearchResults(final_places);
          setIds(updatedIds);
          setLoadingImages(false);
        } catch (error) {
          console.error('Erro na pesquisa:', error);
          setLoadingImages(false);
        }
      } catch (error) {
        console.error(error);
      }}

return (
  <LinearGradient
    colors={['#00EA95', '#B01EEE']}
    style={styles2.gradiente}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
  >
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua pesquisa"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          <TouchableOpacity onPress={handleSearch}>
            <MaterialCommunityIcons name="magnify" size={30} color="black" />
          </TouchableOpacity>
        </View>
        {loadingImages ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          indice.map((estabelecimento, index) => (
            <RestaurantCard
              key={estabelecimento.fsq_id}
              name={estabelecimento.name || 'Nome não disponível'}
              priceRange={estabelecimento.data?.price || 'Consultar'}
              rating={estabelecimento.data?.rating || 'N/A'}
              type={estabelecimento.categories[0].name || 'N/A'}
              userRatingsTotal={estabelecimento.data?.stats?.total_ratings || 'N/A'}
              imageSource={estabelecimento.photoUrl[0]}
              distancia={estabelecimento.distance || 'Distância não disponível'}
              onPress={() => {
                navigation.navigate('DetalhesRestaurante', {
                  restauranteId: estabelecimento.fsq_id,
                  restaurantName: estabelecimento.name || 'Nome não disponível',
                  restauranteRating: estabelecimento.data?.rating || 'N/A',
                  restaurantePrice: estabelecimento.data?.price || 'Consultar',
                  restaurantAddress: estabelecimento.location?.formatted_address || 'Endereço não disponível',
                  restauranteType: estabelecimento.categories[0].name || 'N/A',
                  restauranteRatings: estabelecimento.data?.stats?.total_ratings || 'Rating não disponível',
                  restaurantePhotos: estabelecimento.photoUrl || [],
                  restauranteTip: estabelecimento.data?.tips[0].text || "",
                });
              }}
            />
          ))
        )}
      </View>
    </ScrollView>
  </LinearGradient>
)}

const DetalhesRestauranteScreen = ({ navigation, route }) => {
  const selectedVenue = route.params;
  const restaurantName = selectedVenue.restaurantName;
  const restauranteRating = selectedVenue.restauranteRating;
  const restauranteType = selectedVenue.restaurantType;
  const restaurantePrice = selectedVenue.restaurantePrice;
  const restaurantAddress = selectedVenue.restaurantAddress;
  const restauranteRatings = selectedVenue.restauranteRatings;
  const restaurantePhotos = selectedVenue.restaurantePhotos;
  const restauranteTip = selectedVenue.restauranteTip;
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
      <Stack.Navigator initialRouteName="Search" screenOptions={{ title: 'Pesquisar', headerTitleStyle: {color: 'white', fontSize: 20},headerStyle: { backgroundColor: '#6C009A', color: 'white' }}}>
        <Stack.Screen name="Search" component={Pesquisa} />
        <Stack.Screen name="DetalhesRestaurante" component={DetalhesRestauranteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    marginBottom: 100, 
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 50,
    padding: 10,
    marginBottom: 0,
  },
  textRestaurant: {
    fontWeight: 'bold',
    color:'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  container2: {
    padding: 20,
    backgroundColor: 'transparent',
    flex: 1,
    marginBottom: 100,
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userProfileText: {
    marginLeft: 10,
  },
  subTitle: {
    fontSize: 17,
    marginVertical: 10,
    fontWeight: 'bold',
    color:'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  restaurantCard: {
    marginVertical: 10,
    flexDirection: 'row',
    backgroundColor: '#A087E8',
    padding: 10,
    borderRadius: 10,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  restaurantInfo: {
    marginLeft: 10,
    flex: 1,
  },
  ratingContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  filterIconContainer: {
    flex:1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  transparent: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
  },
  background2: {
    flex: 1,
    
  }
});

const styles2 = StyleSheet.create({
  gradiente: {
    flex: 1,
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
