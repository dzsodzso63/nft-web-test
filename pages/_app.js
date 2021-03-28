process.on('uncaughtException', (error) => {
  console.error('server error', error.stack)
})

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
