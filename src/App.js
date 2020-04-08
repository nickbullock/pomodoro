import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import './App.scss';
import { TodosAPI } from './shared/api/todos';
import { GroupsAPI } from './shared/api/groups';
import { View, Epic, Tabbar, TabbarItem, ModalRoot, Panel, PanelHeader, Div } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Pomodoro } from './shared/components/Pomodoro/Pomodoro';
import { POMODORO_MODE } from './shared/constants';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon28StatisticsOutline from '@vkontakte/icons/dist/28/statistics_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import { GroupsPanel } from './panels/Groups';
import { TodosPanel } from './panels/Todos';
import { STATE, STORY, POMODORO_STATE, TOKEN } from './shared/constants';
import { EditModal } from './modals/EditModal';


const App = () => {
	const [activeModal, setActiveModal] = useState(null);
	const [activeStory, setActiveStory] = useState(STORY.MAIN);
	const [activePanel, setActivePanel] = useState(STATE.MAIN.GROUPS);
	const [activeGroup, setActiveGroup] = useState(null);
	const [activeTodo, setActiveTodo] = useState(null);
	const [activeEdit, setActiveEdit] = useState(null);
	const [fetchedUser, setUser] = useState(null);
	const [pomodoroMode, setPomodoroMode] = useState(POMODORO_MODE.COLLAPSED);
	const [groups, setGroups] = useState([]);
	const [timerState, setTimerState] = useState(POMODORO_STATE.STOPPED);
	const [isFetching, setIsFetching] = useState(false);

	const setActiveGroupAndPanel = group => {
		setActiveGroup(group);
		setActivePanel(STATE.MAIN.TODOS);
	}

	const setActiveTodoAndStartPomodoro = todo => {
		setActiveTodo(todo);
		setPomodoroMode(POMODORO_MODE.FULL);
		setTimerState(POMODORO_STATE.STARTED);
	}

	const togglePomodoroMode = () => {
		setPomodoroMode(pomodoroMode === POMODORO_MODE.FULL ? POMODORO_MODE.COLLAPSED : POMODORO_MODE.FULL);
	}

	// async function install() {
	// 	const key = '[pomodoro]:installed';
	// 	// const isFirstLoad = !localStorage.getItem(key);
	// 	const res = await storageGet(key);
	// 	const isFirstLoad = !(res);

	// 	if (isFirstLoad) {
	// 		const { resourceId } = await createGroup({ title: "Мои задачи" });
	// 		await createTodo({ groupId: resourceId, title: "Пройти обучение" })
	// 		storageSet(key, true);
	// 	}
	// }

	async function fetchUser() {
		const user = await bridge.send('VKWebAppGetUserInfo');
		// const user = {id: 74319754}
		setUser(user);
		return user;
	}

	async function fetchGroups(userId) {
		if (!userId && !fetchedUser.id) return;
		setIsFetching(true);
		const response = await GroupsAPI.query(userId || fetchedUser.id);

		setGroups(response.data);
		setIsFetching(false);
	}

	async function createGroup(body) {
		if (!fetchedUser) return;
		const res = await GroupsAPI.create(fetchedUser.id, body);
		await fetchGroups();
		return res;
	}

	async function deleteGroup(id) {
		if (!fetchedUser) return;
		await GroupsAPI.delete(id);
		await fetchGroups();
	}

	async function updateGroup(id, body) {
		if (!fetchedUser) return;
		await GroupsAPI.update(id, body);
		await fetchGroups();
	}

	async function createTodo(body) {
		if (!fetchedUser) return;
		await TodosAPI.create(body);
		await fetchGroups();
	}

	async function updateTodo(id, body) {
		if (!fetchedUser) return;
		await TodosAPI.update(id, body);
		await fetchGroups();
	}

	async function deleteTodo(id) {
		await TodosAPI.delete(id);
		await fetchGroups();
	}

	useEffect(() => {
		async function fetchData() {
			const user = await fetchUser();
			fetchGroups(user.id)
		}

		fetchData();
	}, []);

	// useEffect(() => {
	// 	if (fetchedUser) {
	// 		// install();
	// 	}
	// }, [fetchedUser]);

	useEffect(() => {
		const newActiveGroup = activeGroup && groups.find(group => group.id === activeGroup.id);
		if (!newActiveGroup) return;
		setActiveGroup(newActiveGroup);
	}, [groups]);

	const goToGroups = () => {
		setActivePanel(STATE.MAIN.GROUPS);
	}

	const showEditDialog = (item) => {
		setActiveModal(STATE.MAIN.EDIT_MODAL);
		setActiveEdit(item);
	}

	const hideModalAndClearValue = () => {
		if (!activeEdit.title || !activeEdit.title) return;
		setActiveModal(null);

		'todos' in activeEdit
			? updateGroup(activeEdit.id, { title: activeEdit.title })
			: updateTodo(activeEdit.id, { title: activeEdit.title });
		setActiveEdit(null);
	}

	const sendNotifications = (message, users = []) => {
		const userIds = users.map(user => user.id);

		bridge.send("VKWebAppCallAPIMethod", {
			method: "notifications.sendMessage",
			request_id: "1",
			params: {
				access_token: TOKEN,
				v: "5.103",
				user_ids: userIds,
				message
			}
		});
	}

	const openFriendsList = async (group) => {
		try {
			const message = `Tебя пригласили в группу ${group.title}.`
			const { users } = await bridge.send("VKWebAppGetFriends", { multi: true });
			const userIds = users && users.map(user => user.id.toString());

			// users.length && sendNotifications(message, users);
			updateGroup(group.id, { ...group, members: [...group.members, ...userIds] });
		}
		catch (e) {
			console.log('error', e)
		}
	}

	const dropActiveTodo = () => setActiveTodo(null);

	const modal = (
		<ModalRoot
			activeModal={activeModal}
		>
			<EditModal id={STATE.MAIN.EDIT_MODAL} onClose={hideModalAndClearValue} entity={activeEdit} onChange={e => setActiveEdit({ ...activeEdit, title: e.target.value })} />
		</ModalRoot>
	);

	return (
		<div className="main">
			<Epic activeStory={activeStory} tabbar={
				<Tabbar>
					<TabbarItem
						onClick={() => setActiveStory(STORY.MAIN)}
						selected={activeStory === STORY.MAIN}
						text="Задачи"
					><Icon28ListOutline /></TabbarItem>
					<TabbarItem
						onClick={() => setActiveStory(STORY.STATS)}
						selected={activeStory === STORY.STATS}
						text="Статистика"
					><Icon28StatisticsOutline /></TabbarItem>
					<TabbarItem
						onClick={() => setActiveStory(STORY.SETTINGS)}
						selected={activeStory === STORY.SETTINGS}
						text="Настройки"
					><Icon28SettingsOutline /></TabbarItem>
				</Tabbar>
			}>
				<View id={STORY.MAIN} activePanel={activePanel} modal={modal}>
					<GroupsPanel
						id={STATE.MAIN.GROUPS}
						onClick={setActiveGroupAndPanel}
						groups={groups}
						fetchedUser={fetchedUser}
						isFetching={isFetching}
						onItemCreate={createGroup}
						onItemDelete={deleteGroup}
						onItemInvite={openFriendsList}
						onItemEdit={showEditDialog}
						onRefresh={fetchGroups}
					/>
					<TodosPanel
						id={STATE.MAIN.TODOS}
						go={goToGroups}
						updateTodo={updateTodo}
						activeGroup={activeGroup}
						groups={groups}
						fetchedUser={fetchedUser}
						isFetching={isFetching}
						onItemCreate={createTodo}
						onItemDelete={deleteTodo}
						onItemUpdate={updateTodo}
						onItemStart={setActiveTodoAndStartPomodoro}
						onItemEdit={showEditDialog}
						onRefresh={fetchGroups}
					/>
				</View>
				<View id={STORY.STATS} activePanel="main">
					<Panel id="main">
						<PanelHeader>
							Статистика
            			</PanelHeader>
						<Div>
							Статистика появится когда-нибудь потом
						</Div>
					</Panel>
				</View>
				<View id={STORY.SETTINGS} activePanel="main">
					<Panel id="main">
						<PanelHeader>
							Настройки
            			</PanelHeader>

						<Div>
							Версия приложения: 0.0.1
						</Div>

					</Panel>
				</View>
			</Epic>
			<Pomodoro
				activeTodo={activeTodo}
				dropActiveTodo={dropActiveTodo}
				mode={pomodoroMode}
				timerState={timerState}
				setTimerState={setTimerState}
				onClick={togglePomodoroMode} />
		</div>
	);
}

export default App;

