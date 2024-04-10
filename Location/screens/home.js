import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Dimensions, Linking, PanResponder} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Swiper from 'react-native-swiper';
import * as Location from 'expo-location';
import axios from 'axios';
import {LinearGradient} from 'expo-linear-gradient';
import firebase from 'firebase';
import { Slider } from 'react-native-elements';

const styles2 = StyleSheet.create({
  
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
    backgroundColor: '#FFFFFF',
  },
  ratingText: {
    fontSize: 16,
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

const styles = StyleSheet.create({
  raioStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFDB00',
    fontWeight:'bold',
    textShadowColor:'#B01EEE',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:2,
    fontSize:20,
    marginTop:20,
  },
  filtroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  raioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  raioLabel: {
    fontSize: 20,
    color: 'white',
    marginRight: 10,
    marginTop: 20
  },
  raioSliderContainer: {
    height: 10,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  salvarFiltrosButton: {
    backgroundColor: '#6C009A',
    padding: 15,
    borderRadius: 10,
  },
  salvarFiltrosButtonText: {
    color: 'white',
    fontSize: 18,
  },
  filtroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtroText: {
    fontSize: 26,
    marginVertical: 10,
    fontWeight: 'bold',
    color:'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },  
  container: {
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
  textRestaurant: {
    fontWeight: 'bold',
    color:'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
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

const tiposPermitidos = ["amusement_park", "aquarium", "art_gallery", "bar", "beauty_salon", "book_store", "bowling_alley", "cafe", "campground", "church",  "department_store", "florist", "food","gym", "hair_care", "hindu_temple", "library", "liquor_store", "lodging", "meal_delivery", "meal_takeaway", "mosque", "movie_theater", "museum", "night_club", "park", "pet_store", "restaurant", "shopping_mall", "spa", "stadium", "synagogue", "tourist_attraction", "zoo"]
;

const tiposPermitidos2 = [

  {
    "category_id": 	13065,
    "category_label": "Restaurantes"
  },
]

const tiposPermitidos3 = [

  {
    "category_id": 	13064,
    "category_label": "Pizzarias"
  },
  {
    "category_id": 	13031,
    "category_label": "Hamburguerias"
  },
  {
    "category_id": 	13276,
    "category_label": "Sushi"
  },
  {
    "category_id": 	17114,
    "category_label": "Shoppings"
  },
  {
    "category_id": 	13018,
    "category_label": "Pubs"
  },
  {
    "category_id": 	13003,
    "category_label": "Bares"
  },
  {
    "category_id": 10032,
    "category_label": "Baladas"
  },
  {
    "category_id": 14000,
    "category_label": "Eventos"
  },
  {
    "category_id": 	13065,
    "category_label": "Restaurantes"
  },
]

const translateCategory = (category) => {
  const categoryTranslations = {
    13018: 'Pubs',
    13065: 'Restaurantes',
    13003: 'Bares',
    17114: 'Shoppings',
    13276: 'Sushi',
    13031: 'Hamburguerias',
    13064: 'Pizzarias',
    10032: 'Baladas'
  };

  return categoryTranslations[category] || category;
};


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

const UserProfile = ({ userName, userLocation, onFilterPress, fotoPerfilUrl, refreshButton }) => (
  <View style={styles.userProfileContainer}>
    <Image source={fotoPerfilUrl ? { uri: fotoPerfilUrl } : require('../img/ft_perfil.jpg')} style={styles.userProfileImage} />
    <View style={styles.userProfileText}>
      <Text style={styles.textRestaurant}>{userName}</Text>
    </View>
    <TouchableOpacity style={styles.filterIconContainer} onPress={refreshButton}>
      <Icon name="refresh" size={25} color="#333" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.filterIconContainer} onPress={onFilterPress}>
      <Icon name="filter-variant" size={25} color="#333" />
    </TouchableOpacity>

  </View>
);

const RestaurantCard = ({ name, type, priceRange, rating, imageSource, onPress, userRatingsTotal, distancia }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.restaurantCard}>
      <Image source={{ uri: imageSource }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <Text style={styles.textRestaurant}>{name}</Text>
        <Text style={styles.textRestaurant}>{type}</Text>
        <Text style={styles.textRestaurant}>{`Distância: ${distancia} m`}</Text>
        <Text style={styles.textRestaurant}>Preço: {mapPriceLevelToSymbol(priceRange)}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <FontAwesomeIcon name="star" size={20} color="yellow" style={styles.starIcon} />
        <Text>{rating}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

function Home({ navigation, route, raioo }) {
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [distancias, setDistancias] = useState({});
  const [dataReturn, setDataReturn] = useState({});
  const [estabelecimentoss, setEstabelecimentoss] = useState([]);
  const [user, setUserName] = useState('');
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [radiusss, setRadius] = useState(0);
  const raiooo = 5000;
  const [userPref, setUserPref] = useState([]);

  const obterEstabelecimentos = async () => {
    try {
      const userId = getUserId();
      const usuarioRef = firebase.firestore().collection('usuários').doc(userId);
      const usuarioDoc = await usuarioRef.get();
      if (usuarioDoc.exists) {
        const radiuss = usuarioDoc.data().radius;
        setRadius(radiuss)
      } 
    } catch (error) {
        console.error(error)
      }
    const raio = radiusss >= 1000 ? radiusss : raiooo;

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissão de localização não concedida');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const novasDistancias = {};
      const novosEstabelecimentos = [];

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'fsq3FBZjdvKpF/IIZRhlr6zp4+4ZER3PyGVaDHQ6otH6n3k='
        }
      };

      const userId = getUserId();
      const usuarioRef = firebase.firestore().collection('usuários').doc(userId);
      const usuarioDoc = await usuarioRef.get();
      const prefs = usuarioDoc.data().preferences;
      const tiposPermitidos4 = tiposPermitidos3.filter(item => prefs.includes(item.category_label));

      await Promise.all(tiposPermitidos4.map(async (tipo) => {
        try {
          const url = `https://api.foursquare.com/v3/places/search?ll=${latitude}%2C${longitude}&radius=${raio}&categories=${tipo.category_id}&fields=fsq_id%2Ccategories%2Cgeocodes%2Cdistance%2Clocation%2Cprice%2Cphotos%2Cstats%2Crating%2Cname&limit=15`;
          
          const resposta = await fetch(url, options);
          const dados = await resposta.json();

          if (!dados.results) {
            throw new Error('Dados de estabelecimentos não encontrados');
          }
          setDataReturn(dados.results);

          const estabelecimentosDentroDoRaio = dados.results.filter((estabelecimento) => {
            const distancia = estabelecimento.distance
            novasDistancias[estabelecimento.fsq_id] = distancia;
            return distancia <= raio
          });

          if (estabelecimentosDentroDoRaio.length > 0) {
            novosEstabelecimentos.push(estabelecimentosDentroDoRaio);

            setCategorias((prevCategorias) => {
              const categoriasEstabelecimentos = { ...prevCategorias };

              estabelecimentosDentroDoRaio.forEach(estabelecimento => {
                estabelecimento.categories.forEach(tipo => {
                  if (tiposPermitidos4.some(tipoPermitido => tipoPermitido.category_id === tipo.id)) {
                    if (!categoriasEstabelecimentos[tipo.id]) {
                      categoriasEstabelecimentos[tipo.id] = [];
                    }
                    categoriasEstabelecimentos[tipo.id].push(estabelecimento);
                  }
                });
              });

              return categoriasEstabelecimentos;
            });
          }

          } catch (error) {
          console.error(`Erro ao obter estabelecimentos do tipo ${tipo}:`, error);
        }
      }));
      setDistancias(novasDistancias);
      setEstabelecimentos(novosEstabelecimentos.flat(1));

    } catch (error) {
      console.error('Erro ao obter a localização ou buscar estabelecimentos:', error);
    }
  };

  const getUserId = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      return user.uid;
    } else {
      console.warn('Usuário não autenticado.');
      return null;
    }
  };

  const obterNomeUsuario = async () => {
    try {
      const userId = getUserId();
      const usuarioRef = firebase.firestore().collection('usuários').doc(userId);
      const usuarioDoc = await usuarioRef.get();
      if (usuarioDoc.exists) {
        const nomeUsuario = usuarioDoc.data().username;
        const fotoPerfilUrl = usuarioDoc.data().image;
        setUserName(nomeUsuario);
        setFotoPerfilUrl(fotoPerfilUrl);
      } else {
        console.error('Documento de usuário não encontrado');
      }
    } catch (error) {
      console.error('Erro ao obter o nome do usuário:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      setEstabelecimentos([]);
      setCategorias({});
      setDistancias({});
      setDataReturn({});
      setEstabelecimentoss([]);
      setFotoPerfilUrl('');
      setUserName('');

      await obterEstabelecimentos()
      await obterNomeUsuario();
    } catch (error) {
      console.error('Erro ao recarregar estabelecimentos:', error);
    } finally {
      setRefreshKey((prevKey) => prevKey + 1);
    }
  };

  useEffect(() => {
    obterNomeUsuario();

    obterEstabelecimentos();
  }, []);

  const renderCategoria = (categoria, index) => {
    const translatedCategory = translateCategory(categoria);
    
    return (
      <View key={index} style={styles.transparent}>
        <Text style={styles.subTitle}>{`Melhores ${translatedCategory.toLowerCase()} na sua região`}</Text>
        {categorias[categoria]?.slice(0, 5).map((estabelecimento, index) => (
          <RestaurantCard
            key={estabelecimento.fsq_id}
            name={estabelecimento.name || 'Nome não disponível'}
            priceRange={estabelecimento.price || 'Consultar'}
            rating={estabelecimento.rating || 'N/A'}
            type={translatedCategory}
            userRatingsTotal={estabelecimento.stats?.total_ratings || 'N/A'}
            imageSource={
              estabelecimento.photos && estabelecimento.photos.length > 0
                ? `${estabelecimento.photos[0].prefix}original${estabelecimento.photos[0].suffix}`
                : `${estabelecimento.categories[0].icon.prefix}120${estabelecimento.categories[0].icon.suffix}`
            }
            distancia={estabelecimento.distance || 'Distância não disponível'}
            onPress={() => {
              navigation.navigate('DetalhesRestaurante', {
                restauranteId: estabelecimento.fsq_id,
                restaurantName: estabelecimento.name || 'Nome não disponível',
                restauranteRating: estabelecimento.rating || 'N/A',
                restaurantePrice: estabelecimento.price || 'Consultar',
                restaurantAddress: estabelecimento.location?.formatted_address || 'Endereço não disponível',
                restauranteType: translatedCategory,
                restauranteRatings: estabelecimento.stats?.total_ratings || 'Rating não disponível',
                restaurantePhotos: estabelecimento.photos || []
              });
            }}
          />
        ))}
        <TouchableOpacity
          style={{ marginVertical: 10, alignItems: 'center', borderWidth: 2, borderRadius: 50, backgroundColor: '#6C009A', padding: 7}}
          onPress={() => {
            navigation.navigate('CardsCategoria', { categoria, categorias, RestaurantCard, dataReturn });
          }}
        >
          <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold'}}>Ver mais</Text>
        </TouchableOpacity>
      </View>
    );
  };

    return (
      
    
    <View style={styles.background2}>
    <LinearGradient
      colors={['#00EA95', '#B01EEE']}
      style={styles2.gradiente}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
    <ScrollView>
      <View style={styles.container}>
        <UserProfile
          userName={user}
          userLocation="Sua Localização Atual"
          onFilterPress={() => navigation.navigate('Filtros')}
          fotoPerfilUrl={fotoPerfilUrl}
          refreshButton={handleRefresh}
        />
        {Object.keys(categorias).map((categoria, index) => renderCategoria(categoria, index))}
      </View>
      </ScrollView>
      </LinearGradient>
    </View>
    
    
  );
}

  const CardsCategoria = ({ navigation, route }) => {
    const apiKey = '';
    const { categoria, categorias } = route.params;
    const [cardsCategoria, setCardsCategoria] = useState([]);
    const cardsCategoria2 = categorias[categoria];
    const translatedCategory = translateCategory(categoria);
    const data = route.params?.dataReturn;
    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [categorias2, setCategorias] = useState({});
    const [next_page, set_next_page] = useState('');

    useEffect(() => {
      setCardsCategoria(cardsCategoria2);
    }, [cardsCategoria2]);

    const obterEstabelecimentos2 = async () => {
      try {
        const dados2 = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${data.next_page_token}&key=${apiKey}`
        );

        const data2 = dados2.data;

        if (!next_page) {
          set_next_page(data.next_page_token);

          if (categoria && data2.results.every(estabelecimento => !estabelecimento.types.includes(categoria))) {
            console.log('Categoria não encontrada nos resultados.');
            return;
          } else {
            const estabelecimentosFiltrados = data2.results.filter(estabelecimento => {
              const tipoEncontrado = estabelecimento.types.find(categoria => tiposPermitidos.includes(categoria));
              return tipoEncontrado !== undefined;
            });

            const categoriasEstabelecimentos = {};

            estabelecimentosFiltrados.forEach(estabelecimento => {
              estabelecimento.types.forEach(categoriaa => {
                if (categoria.includes(categoriaa)) {
                  if (!categoriasEstabelecimentos[categoriaa]) {
                    categoriasEstabelecimentos[categoriaa] = [];
                  }

                  const restauranteExistente = categoriasEstabelecimentos[categoriaa].some(
                    r => r.id === estabelecimento.id
                  );

                  if (!restauranteExistente) {
                    categoriasEstabelecimentos[categoriaa].push(estabelecimento);
                  }
                }
              });
            });

            setEstabelecimentos(estabelecimentosFiltrados);
            setCategorias(categoriasEstabelecimentos);

            if (categoriasEstabelecimentos[categoria]) {
              setCardsCategoria(prevCards => [
                ...prevCards,
                ...categoriasEstabelecimentos[categoria]
              ]);
            } else {
              console.log(`A categoria ${categoria} não existe em categoriasEstabelecimentos.`);
            }
          }
        } else {
          console.log('next_page já foi passado como parâmetro.');
        }
      } catch (error) {
        console.error('Erro ao obter a localização ou buscar estabelecimentos:', error);
      }
    };

    useEffect(() => {
      obterEstabelecimentos2();
    }, []);

      return (
        <View style={styles.background}>
        <LinearGradient
        colors={['#00EA95', '#B01EEE']}
        style={styles2.gradiente}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.subTitle}>{`Todos os ${translatedCategory.toLowerCase()} na sua região`}</Text>
            {cardsCategoria.map((estabelecimento, index) => (
              <RestaurantCard
                key={estabelecimento.fsq_id}
                name={estabelecimento.name || 'Nome não disponível'}
                priceRange={estabelecimento.price || 'Consultar'}
                rating={estabelecimento.rating || 'N/A'}
                type={translatedCategory}
                userRatingsTotal={estabelecimento.stats?.total_ratings || 'N/A'}
                imageSource={
                  estabelecimento.photos && estabelecimento.photos.length > 0
                    ? `${estabelecimento.photos[0].prefix}original${estabelecimento.photos[0].suffix}`
                    : `${estabelecimento.categories[0].icon.prefix}120${estabelecimento.categories[0].icon.suffix}`
                }
                distancia={estabelecimento.distance || 'Distância não disponível'}
                onPress={() => {
                  navigation.navigate('DetalhesRestaurante', {
                    restauranteId: estabelecimento.fsq_id,
                    restaurantName: estabelecimento.name || 'Nome não disponível',
                    restauranteRating: estabelecimento.rating || 'N/A',
                    restaurantePrice: estabelecimento.price || 'Consultar',
                    restaurantAddress: estabelecimento.location?.formatted_address || 'Endereço não disponível',
                    restauranteType: translatedCategory,
                    restauranteRatings: estabelecimento.stats?.total_ratings || 'Rating não disponível',
                    restaurantePhotos: estabelecimento.photos || []
                  });
                }}
              />
            ))}
          </View>
        </ScrollView>
        </LinearGradient>
        </View>
      );
    };


const { height } = Dimensions.get('window');

const DetalhesRestauranteScreen = ({ navigation, route }) => {
  const restauranteId = route.params?.restauranteId;
  const restaurantName = route.params?.restaurantName;
  const restauranteRating = route.params?.restauranteRating;
  const restauranteType = route.params?.restauranteType;
  const restaurantePrice = route.params?.restaurantePrice;
  const restaurantAddress = route.params?.restaurantAddress;
  const restauranteRatings = route.params?.restauranteRatings;
  const restaurantePhotos = route.params?.restaurantePhotos;

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
      style={styles2.gradiente}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
    <ScrollView>
      <View style={styles2.container}>
        <View style={styles2.containerWrapper}>
          <Swiper
            style={styles2.wrapper}
            loop={true}
            height={height * 0.4}
            dotStyle={styles2.dot}
            activeDotStyle={styles2.activeDot}
            paginationStyle={styles2.paginationStyle}
          >
            {restaurantePhotos.map((prefixo, index) => (
              <ImageBackground
                key={index}
                source={{ uri: `${prefixo.prefix}original${prefixo.suffix}` }}
                style={styles2.carouselImage}
                imageStyle={styles2.imageBackground}
              >
                <View style={styles2.titleContainer}>
                  <Text style={styles2.titleText}>{restaurantName}</Text>
                </View>
                <TouchableOpacity
                  style={styles2.favoriteIconContainer}
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

        <View style={styles2.infoContainer}>
          <View style={styles2.categoryContainer}>
            <Text style={styles2.categoryText}>{restauranteType}</Text>
          </View>
          <View style={styles2.divider} />
          {relevantReview && (
          <View style={styles2.ratingContainer}>
            <Text style={styles2.ratingText}>{relevantReview.text}</Text>
          </View>
          )}
          <View style={styles2.priceContainer}>
            <Text style={styles2.priceText}>{`Preço: ${mapPriceLevelToSymbol(restaurantePrice)}`}</Text>
          </View>
          <View style={styles2.ratingInfoContainer}>
            <View style={styles2.starsContainer}>
              <FontAwesomeIcon name="star" size={20} color="white" style={styles2.starIcon2} />
            </View>
            <View style={styles2.ratingTextContainer}>
              <Text style={styles2.starsText}>{restauranteRating}</Text>
            </View>
            <Text style={styles2.verticalDivider}>|</Text>
            <Text style={styles2.reviewsText}>{restauranteRatings} avaliações</Text>
          </View>
          <Text style={styles2.address}>{restaurantAddress}</Text>
          <View style={styles2.container}>
            <TouchableOpacity onPress={openGoogleMaps} style={styles2.googleMapsButton}>
              <LinearGradient
                colors={['#ffdb00', '#FFDB00']}
                style={styles2.googleMapsButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              >
                <Text style={styles2.googleMapsButtonText}>Abrir no Google Maps</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles2.bottomT}></Text>
          </View>
        </View>
      </View>
      </ScrollView>
    </LinearGradient>
  );
};

const Filters = ({ navigation }) => {
  const [raio, setRaio] = useState(1000);

  const salvarFiltros = async () => {
    try {
      const userId = getUserId();
      const usuarioRef = firebase.firestore().collection('usuários').doc(userId);
      const usuarioDoc = await usuarioRef.get();
      if (usuarioDoc.exists) {
        await usuarioRef.update({
          radius: raio,
        });
      navigation.navigate('Home', { novoRaio: raio });
      }
    } catch (error) {
      console.error("Error: ", error)
    }
  };

  const getUserId = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      return user.uid;
    } else {
      console.warn('Usuário não autenticado.');
      return null;
    }
  };



  return (
    <LinearGradient
      colors={['#00EA95', '#B01EEE']}
      style={styles2.gradiente}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.background2}>
        <View style={styles.filtroContainer}>
          <Text style={styles.filtroText}>Filtros</Text>
          <Text style={styles.raioStyle}>Raio</Text>
          <View style={styles.raioContainer}>
            <Text style={styles.raioLabel}>
              {raio >= 100000 ? '100Km' : `${(raio / 1000).toFixed(1)}Km`}
            </Text>
            <Slider
              style={styles.raioSliderContainer}
              value={raio / 1000}
              onValueChange={(value) => setRaio(value * 1000)}
              minimumValue={1}
              maximumValue={100}
              step={1}
              minimumTrackTintColor='#FFDB00'
              maximumTrackTintColor='black'
              thumbTintColor='#6C009A'
              
            />
          </View>
          <TouchableOpacity onPress={salvarFiltros} style={styles.salvarFiltrosButton}>
            <Text style={styles.salvarFiltrosButtonText}>Salvar filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default function Main() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ title: 'Início', headerTitleStyle: {color: 'white', fontSize: 20},headerStyle: { backgroundColor: '#6C009A', color: 'white' }}}>
        <Stack.Screen name="Home"  component={Home} />
        <Stack.Screen name="DetalhesRestaurante" component={DetalhesRestauranteScreen}/>
        <Stack.Screen name="CardsCategoria" component={CardsCategoria} />
        <Stack.Screen name="Filtros" component={Filters} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}