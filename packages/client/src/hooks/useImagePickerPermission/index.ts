import React from "react";
import * as ImagePicker from "expo-image-picker";
export const useImagePickerPermission = () => {
  const [state, setState] = React.useState({
    camera: false,
    gallery: false,
  });

  React.useEffect(() => {
    ImagePicker.getCameraPermissionsAsync().then(({ granted }) => {
      if (granted) {
        setState((state) => ({ ...state, camera: granted }));
      } else {
        ImagePicker.requestCameraPermissionsAsync().then(({ granted }) =>
          setState((state) => ({ ...state, camera: granted }))
        );
      }
    });
    ImagePicker.getMediaLibraryPermissionsAsync().then(({ granted }) => {
      if (granted) {
        setState((state) => ({ ...state, gallery: granted }));
      } else {
        ImagePicker.requestMediaLibraryPermissionsAsync().then(({ granted }) =>
          setState((state) => ({ ...state, gallery: granted }))
        );
      }
    });
  }, []);

  return {
    ...state,
  };
};
