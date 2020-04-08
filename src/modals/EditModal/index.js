import React from 'react';
import { ModalPage, ModalPageHeader, FormLayout, FormLayoutGroup, Input, PanelHeaderButton, usePlatform, IOS } from '@vkontakte/vkui';

import Icon24Done from '@vkontakte/icons/dist/24/done';

export const EditModal = ({ id, onClose, onChange, entity }) => {
    const platform = usePlatform();
    const IS_PLATFORM_IOS = platform === IOS;

    const handleKeyDown = e => {
        const { value } = e.target;
        if (value && e.key === 'Enter') {
            onClose()
        }
    }

    return (
        <ModalPage
            id={id}
            onClose={onClose}
            header={
                <ModalPageHeader
                    right={<PanelHeaderButton onClick={onClose}>{IS_PLATFORM_IOS ? 'Готово' : <Icon24Done />}</PanelHeaderButton>}
                >
                    Редактирование
                    </ModalPageHeader>
            }
        >
            <FormLayout>
                <FormLayoutGroup top="Введите новое название">
                    {entity && <Input value={entity.title} onChange={onChange} onKeyDown={handleKeyDown}></Input>}
                </FormLayoutGroup>
            </FormLayout>
        </ModalPage>
    );
}