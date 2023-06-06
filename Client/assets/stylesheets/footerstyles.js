import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
  fmenu: {
    height: 40,
    width: 60,
    marginLeft: 20,
    marginTop: 18
  },
  fcontainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    backgroundColor: '#c9f1fd',
    display: 'flex',
    height: 75,
    flexDirection: 'row'
  },
  fadd: {
    height: 40,
    width: 40,
    marginLeft: 115,
    marginTop: 13
  },
  ftextadd: {
    marginLeft: 120,
  },
  fposts: {
    height: 40,
    width: 40,
    marginLeft: 25,
    marginTop: 13
  },
  ftextposts: {
    marginLeft: 27,
  },
  fsearch: {
    height: 50,
    width: 40,
    marginLeft: 25,
    marginTop: 3
  },
  ftextsearch: {
    marginLeft: 25,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '#F5FCFF'
  },
  menuContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9CE4FF',
    width: '100%',
    height: '65%'
  },
  menuClose: {
    marginBottom: 75,
    fontSize: 27,
    marginTop: -35,
    fontWeight: 'bold'
  },
  fmohome: {
    fontSize: 27,
    marginBottom: 45,
    fontWeight: 'bold'
  },
  fmoposts: {
    fontSize: 27,
    marginBottom: 45,
    fontWeight: 'bold'
  },
  fmonpost: {
    fontSize: 27,
    marginBottom: 45,
    fontWeight: 'bold'
  },
  fmosearch: {
    fontSize: 27,
    marginBottom: 45,
    fontWeight: 'bold'
  },
  fmologout: {
    fontSize: 27,
    marginBottom: 45,
    fontWeight: 'bold'
  },
  fsizer: {
    height: 300
  }
});

export default Styles;

