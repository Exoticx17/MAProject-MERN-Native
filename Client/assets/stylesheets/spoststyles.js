import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
    spimages:{
        height: 200,
        width: '93%',
        marginTop: 15,
        marginLeft: 14,
        borderRadius: 8
      },
      spphotocap:{
        fontSize: 20,
        height: 50,
        width: 160,
        fontWeight: 'bold',
        marginTop: 40,
        textAlign: 'center'
      },
      spcenter: {
        justifyContent: 'center',
        alignItems: 'center'
      },
      scomment:{
        fontSize: 16,
        height: 30,
        width: 160,
        width: 300,
        marginTop: 13,
        textAlign: 'center',
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        paddingTop: 4,
        borderRadius: 6
      },
      scview:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },
      saform:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        backgroundColor: 'lightgray',
        width: 300,
        alignSelf: 'center',
        borderRadius: 6,
        height: 135
      },
      satitle: {
        fontSize: 16,
        height: 30,
        width: 160,
        width: 300,
        textAlign: 'center',
        justifyContent: 'center',
        paddingTop: 4,
        backgroundColor: 'teal',
        borderTopRightRadius: 6,
        borderTopLeftRadius: 6
      },
      sai: {
        fontSize: 16,
        height: 30,
        width: 160,
        width: 300,
        textAlign: 'center',
        justifyContent: 'center',
        paddingTop: 4,
        backgroundColor: 'teal'
      },
      ssf: {
        height: 30,
        width: 160,
        width: 300,
        textAlign: 'center',
        justifyContent: 'center',
        paddingTop: 4,
        backgroundColor: 'teal',
        borderBottomRightRadius: 6,
        borderBottomLeftRadius: 6
      },
      ssub: {
        backgroundColor: 'pink',
        width: 125,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 6
      }
});

export default Styles;

