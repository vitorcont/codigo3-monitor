import React from "react";
import ReactDOM from "react-dom/client";
import { SocketProvider } from "./context/SocketContext";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Heatmap from "./pages/Heatmap/Heatmap";
import App from "./pages/MainMap/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<SocketProvider>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<App />} />
					<Route path='/heatmap' element={<Heatmap />} />
				</Routes>
			</BrowserRouter>
		</SocketProvider>
	</React.StrictMode>,
);
