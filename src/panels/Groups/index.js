import React, { useState } from 'react';
import { Panel, PanelHeader, Cell, List, Counter, Avatar, Group, Div, FormLayoutGroup, FormLayout, Input, Footer, PullToRefresh } from '@vkontakte/vkui';
import Swipeout from 'rc-swipeout';
import 'rc-swipeout/dist/rc-swipeout.min.css';

export const GroupsPanel = ({ id, groups, onClick, fetchedUser, onItemCreate, onItemInvite, onItemEdit, onItemDelete, onRefresh, isFetching }) => {
    const [text, setText] = useState("");

    const handleKeyDown = e => {
        const { value } = e.target;
        if (value && e.key === 'Enter') {
            const group = { id: 0, title: value };

            onItemCreate(group);
            setText('');
        }
    }
    const handleChange = e => {
        setText(e.target.value)
    }

    return (
        <Panel id={id}>
            <PanelHeader>
                Группы
            </PanelHeader>
            <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
                <Group>
                    {fetchedUser && <Cell
                        before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}></Avatar> : null}>{`${fetchedUser.first_name} ${fetchedUser.last_name}`}</Cell>}
                    <FormLayout>
                        <FormLayoutGroup top="Добавить группу">
                            <Input
                                type="text"
                                value={text}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Например, Домашние дела" />
                        </FormLayoutGroup>
                    </FormLayout>
                    <List>
                        {groups.map(group => {
                            return (
                                <Swipeout
                                    key={group.id}
                                    autoClose
                                    right={[
                                        {
                                            text: 'Пригласить',
                                            onPress: () => onItemInvite(group),
                                            style: { backgroundColor: 'var(--button_commerce_background)', color: 'white' },
                                        },
                                        {
                                            text: 'Редактировать',
                                            onPress: () => onItemEdit(group),
                                            style: { backgroundColor: 'var(--button_primary_background)', color: 'white' },
                                        },
                                        {
                                            text: 'Удалить',
                                            onPress: () => onItemDelete(group.id),
                                            style: { backgroundColor: 'var(--destructive)', color: 'white' },
                                        },
                                    ]}>
                                    <Cell
                                        key={group.id}
                                        expandable
                                        indicator={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><div style={{marginRight: '10px'}}>{group.members.length > 1 ? `Участников: ${group.members.length}` : 'Только вы'}</div><Counter mode="primary">{group.todos.length}</Counter></div>}
                                        onClick={() => onClick(group)}>
                                        {group.title}
                                    </Cell>
                                </Swipeout>
                            )
                        })}
                    </List>
                    <Footer>Групп: {groups.length}</Footer>
                </Group>
            </PullToRefresh>
        </Panel>
    );
}

GroupsPanel.defaultProps = {
    groups: []
}