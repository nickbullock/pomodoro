import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Group, Input, PullToRefresh, FormLayout, FormLayoutGroup, Footer, Checkbox } from '@vkontakte/vkui';
import { STATE } from '../../shared/constants';
import Swipeout from 'rc-swipeout';
import 'rc-swipeout/dist/rc-swipeout.min.css';

const TODO_STATUS = {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    DONE: 'done'
}

export const TodosPanel = ({ id, go, activeGroup, onItemUpdate, onItemCreate, onItemDelete, onItemEdit, onItemStart, isFetching, onRefresh }) => {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState("");

    const toggleTodo = e => {
        const activeTodoId = +e.target.dataset.id;
        const activeTodoStatus = e.target.dataset.status;
        const todoToUpdate = todos.find(todo => todo.id === activeTodoId);

        if (!todoToUpdate) return;

        todoToUpdate.status = activeTodoStatus === TODO_STATUS.DONE ? TODO_STATUS.NEW : TODO_STATUS.DONE;
        setTodos([...todos]);
        onItemUpdate(todoToUpdate.id, todoToUpdate);
    };
    const createTodo = todo => {
        setTodos([...todos, todo]);
        onItemCreate(todo);
    }
    const handleKeyDown = e => {
        const { value } = e.target;
        if (value && e.key === 'Enter') {
            const todo = { id: 0, title: value, status: TODO_STATUS.NEW, groupId: activeGroup.id };

            createTodo(todo)
            setText('');
        }
    }
    const handleChange = e => {
        setText(e.target.value)
    }

    useEffect(() => {
        setTodos(activeGroup.todos);
    }, [activeGroup]);

    return (
        <Panel id={id}>
            <PanelHeader left={<PanelHeaderBack onClick={go} data-state={STATE.MAIN.GROUPS} />}>
                {activeGroup.title}
            </PanelHeader>
            <PullToRefresh onRefresh={onRefresh} isFetching={isFetching}>
                <Group>
                    <FormLayout>
                        <FormLayoutGroup top="Добавить задачу">
                            <Input
                                type="text"
                                value={text}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Например, прочитать статью" />
                        </FormLayoutGroup>
                    </FormLayout>
                    <Group className="list-group">
                        {todos.map(todo => {
                            return (
                                <Swipeout
                                    key={todo.id}
                                    autoClose
                                    right={[
                                        {
                                            text: 'Начать',
                                            onPress: () => onItemStart(todo),
                                            style: { backgroundColor: 'var(--button_commerce_background)', color: 'white' },
                                        },
                                        {
                                            text: 'Редактировать',
                                            onPress: () => onItemEdit(todo),
                                            style: { backgroundColor: 'var(--button_primary_background)', color: 'white' },
                                        },
                                        {
                                            text: 'Удалить',
                                            onPress: () => onItemDelete(todo.id),
                                            style: { backgroundColor: 'var(--destructive)', color: 'white' },
                                        },
                                    ]}>
                                    <Checkbox
                                        className="todos__cb list-group-item"
                                        checked={todo.status === TODO_STATUS.DONE}
                                        onChange={toggleTodo}
                                        data-id={todo.id}
                                        data-status={todo.status}>

                                        {todo.title}

                                    </Checkbox>
                                </Swipeout>

                            )
                        })}
                        <Footer>Задач: {todos.length}</Footer>
                    </Group>

                </Group>
            </PullToRefresh>
        </Panel>
    );
}