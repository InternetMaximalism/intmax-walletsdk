import { DrawerPropsPattern, useDrawerStore } from "@/stores/drawers";
import { useCallback } from "react";

export const useDrawer = () => {
	const store = useDrawerStore();

	const open = useCallback(
		(props: DrawerPropsPattern, previos?: DrawerPropsPattern) => {
			if (previos) store.setDrawerProps({ ...props, previos });
			else if (store.props) {
				store.setDrawerProps({ ...props, previos: store.props });
				store.setLock(false);
			} else {
				setTimeout(() => store.setDrawerProps(props), 500);
			}
		},
		[store.setDrawerProps, store.setLock, store.props],
	);

	const close = useCallback(() => {
		store.setLock(false);
		store.setDrawerProps(null);
	}, [store.setDrawerProps, store.setLock]);

	const back = useCallback(() => {
		if (store.props?.previos) store.setDrawerProps(store.props.previos);
		else close();
	}, [store.props?.previos, close, store.setDrawerProps]);

	return { open, close, back, props: store.props };
};
