import Header from "../../components/Header/Header";
import styles from "./calendarpage.module.css";

const CalendarPage = () => {
	return (
		<div className={`${styles.page} page`}>
			<Header></Header>
			<div className={`${styles.content} page-content`}>
				<h1>Calendar</h1>
			</div>
		</div>
	);
};

export default CalendarPage;
