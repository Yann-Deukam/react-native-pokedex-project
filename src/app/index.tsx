import RouteCard from '@/components/RouteCard'
import ThemeText from '@/components/ThemeText'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NAV_ITEMS, NavItem } from '../../constants/routes'

const COLUMNS = 2

// Split the nav items into rows of COLUMNS
const rows: NavItem[][] = []
for (let i = 0; i < NAV_ITEMS.length; i += COLUMNS) {
  rows.push(NAV_ITEMS.slice(i, i + COLUMNS))
}

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoArea}>
        {/* <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        /> */}
      </View>

      <ThemeText style={styles.title}>
        What Pokemon{'\n'}are you looking for?
      </ThemeText>

      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(item => (
              <RouteCard key={item.label} {...item} />
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  logoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200
  },

  logo: {
    width: '80%',
    height: '100%',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
    color: '#1F2937',
    marginBottom: 20,
  },

  grid: {
    flex: 2,
    gap: 14,
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 14,
  },
})