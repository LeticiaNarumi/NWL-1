import React from 'react';
import './styles.css';
import logo from '../../assets/logo.svg';
import { FiLogIn } from 'react-icons/fi';

const Icon = FiLogIn as unknown as React.FC;

const Home = () => {
    return(
        <div id="page-home">
            <div className="content">
                <header>
                <img src={logo} alt="Ecoleta" />
                </header>

                <main>
                    <h1>Seu marketplace de coleta de residuos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

                    <a href="/cadastro">
                    <span>
                        <Icon />
                    </span>
                    <strong>Cadastre um ponto de coleta.</strong>
                    </a>
                </main>
            </div>
        </div>
    )
}

export default Home;