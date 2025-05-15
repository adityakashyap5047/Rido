import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { FC, memo } from 'react'
import { modalStyles } from '@/styles/modalStyles';

interface MapPickerModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    selectLocation: {
        latitude: number;
        longitude: number;
        address: string;
    };
    onSelectLocation: (data: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}

const MapPickerModal: FC<MapPickerModalProps> = ({
    visible,
    onClose,
    title,
    selectLocation,
    onSelectLocation
}) => {
  return (
    <Modal
        animationType='slide'
        visible={visible}
        presentationStyle='formSheet'
        onRequestClose={onClose}
    >
        <View style={modalStyles.modalContainer}>
            <Text style={modalStyles?.centerText}>Select {title}</Text>

            <TouchableOpacity onPress={onClose}>
                <Text style={modalStyles?.cancelButton}>Cancel</Text>
            </TouchableOpacity>
        </View>
    </Modal>
  )
}

export default memo(MapPickerModal);