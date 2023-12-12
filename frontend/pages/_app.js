import React from 'react';
import { LayoutProvider } from '@/layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import { globalState } from '@/store/store';
import { Provider } from 'react-redux';

export default function MyApp({ Component, pageProps }) {
    if (Component.getLayout) {
        return (
            <Provider store={globalState}>
                <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>
            </Provider>
        );
    } else {
        return (
            <Provider store={globalState}>
                <LayoutProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </LayoutProvider>
            </Provider>
        );
    }
}
