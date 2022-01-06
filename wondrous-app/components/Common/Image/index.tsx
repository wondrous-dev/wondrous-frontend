// import React, { useState, useEffect } from 'react'
// import { useLazyQuery } from '@apollo/client'

// export const CachedImage = props => {
//   const { source: { uri }, cacheKey, setCachedImage } = props
//   const [imgURI, setImgURI] = useState(null)
//   useEffect(() => {
//     const loadImage = async () => {
//       const hashed = await Crypto.digestStringAsync(
//         Crypto.CryptoDigestAlgorithm.SHA256,
//         cacheKey
//       )

//       const fileURI = `${FileSystem.cacheDirectory}${hashed}`
//       try {
//         // Use the cached image if it exists
//         const metadata = await FileSystem.getInfoAsync(fileURI)
//         if (!metadata.exists) {
//           // download to cache
//           const result = await FileSystem.downloadAsync(
//             uri,
//             fileURI
//           )
//           setImgURI(fileURI)
//           setCachedImage(fileURI)
//         } else {
//           setImgURI(fileURI)
//         }
//       } catch (err) {
//         setImgURI(uri)
//       }
//     }

//     loadImage()
//   }, [])// eslint-disable-line react-hooks/exhaustive-deps
//   return (
//     <Image
//     // eslint-disable-next-line react/jsx-props-no-spreading
//       {...props}
//       source={{
//         uri: imgURI,
//       }}
//     />
//   )
// }

// export const ModalImage = ({ src, style, defaultImage, setImage }) => {
//   const [getImage, { data, loading, error }] = useLazyQuery(GET_PREVIEW_IMAGE, {
//     variables: {
//       path: src
//     },
//     fetchPolicy: 'network-only'
//   })

//   const [pictureModal, setPictureModal] = useState(false)
//   const [cachedImage, setCachedImage] = useState(null)

//   useEffect(() => {
//     if (cachedImage) {
//       if (setImage && !(src?.startsWith('https') || src?.startsWith('file://'))) {
//         setImage(cachedImage)
//       }
//     } else if (data && data.getPreviewImage && data.getPreviewImage.url) {
//       if (setImage && !(src?.startsWith('https') || src?.startsWith('file://'))) {
//         setImage(data.getPreviewImage.url)
//       }
//     }
//     if (!cachedImage && !data) {
//       getCacheImage({ cacheKey: src, setCachedImage, getImage })
//     }
//   }, [data, cachedImage])

//   const openPictureModal = () => {
//     setPictureModal(true)
//   }

//   if (!src && defaultImage) {
//     return <Image style={style} source={defaultImage} />
//   }

//   if (src?.startsWith('https') || src?.startsWith('file://')) {
//     return src?.startsWith('file://') ?
//     <>
//     <PictureModal isVisible={pictureModal} setModalVisible={setPictureModal} picture={src} />
//     <Pressable onPress={openPictureModal} style={{
//       flex: 1
//     }}></Pressable>
//     <Image style={style} key={src} source={{
//       uri: src
//     }} />
//     </>
//     :
//     <>
//     <PictureModal isVisible={pictureModal} setModalVisible={setPictureModal} picture={src} />
//     <Pressable onPress={openPictureModal} style={{
//       flex: 1
//     }}>
//     <CachedImage cacheKey={src} style={style} key={src} source={{
//       uri: src
//     }} />
//     </Pressable>
//     </>
//   } else if (cachedImage || data?.getPreviewImage?.url) {
//     return (
//       <>
//       <PictureModal isVisible={pictureModal} setModalVisible={setPictureModal} picture={cachedImage || data?.getPreviewImage?.url} />
//       <Pressable onPress={openPictureModal} style={{
//         flex: 1
//       }}>
//       <CachedImage cacheKey={src} style={style} key={src} setCachedImage={setCachedImage} source={{
//         uri: (cachedImage || data?.getPreviewImage?.url)
//       }} />
//       </Pressable>
//       </>
//     )
//   }
//   return null
// }

// export const SafeImage = ({ src, style, defaultImage, setImage }) => {
//   const [getImage, { data, loading, error }] = useLazyQuery(GET_PREVIEW_IMAGE, {
//     variables: {
//       path: src
//     },
//     fetchPolicy: 'network-only'
//   })

//   const [cachedImage, setCachedImage] = useState(null)

//   useEffect(() => {
//     if (cachedImage) {
//       if (setImage && !(src?.startsWith('https') || src.startsWith('file://'))) {
//         setImage(cachedImage)
//       }
//     } else if (data && data.getPreviewImage && data.getPreviewImage.url) {
//       if (setImage && !(src?.startsWith('https') || src?.startsWith('file://'))) {
//         setImage(data.getPreviewImage.url)
//       }
//     }
//     if (!cachedImage && !data) {
//       getCacheImage({ cacheKey: src, setCachedImage, getImage })
//     }
//   }, [data, cachedImage])

//   if (!src && defaultImage) {
//     return <Image style={style} source={defaultImage} />
//   }

//   if (src?.startsWith('https') || src?.startsWith('file://')) {
//     return src?.startsWith('file://') ? <Image style={style} key={src} source={{
//       uri: src
//     }} /> :
//     <CachedImage cacheKey={src} style={style} key={src} source={{
//       uri: src
//     }} />
//   } else if (cachedImage || data?.getPreviewImage?.url) {
//     return (<CachedImage cacheKey={src} style={style} key={src} setCachedImage={setCachedImage} source={{
//       uri: (cachedImage || data?.getPreviewImage?.url)
//     }} />)
//   }
//   return null
// }
