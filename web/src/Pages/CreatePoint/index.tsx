import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import "./styles.css";
import logo from "../../assets/logo.svg";
import axios from "axios";
import { LeafletMouseEvent } from "leaflet";

import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import api from "../../services/api";

const center = [-25.4405967, -49.213212] as [number, number]

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla:string;
}

interface IBGECityResponse {
    nome:string;
}

const CreatePoint = () => {
    const [ items, setItems ] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [ initialPosition, setInitialPosition ] = useState<[number, number] | null>(null);

    const [ formData, setFormData ] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });

    const [selectedCity, setSelectedCity] = useState("0")
    const [selectedUF, setSelectedUF] = useState('0');
    const [ selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]> ([0, 0]);

    const navigate = useNavigate();

    useEffect (() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords

            setInitialPosition([latitude, longitude]);
            setSelectedPosition([latitude, longitude]);
        },
        () => {
            const fallback: [number, number] = [-25.44, -49.21]; 
            setInitialPosition(fallback);
            setSelectedPosition(fallback);
        }
    );
    }, []);
    
    useEffect (() => {
        api.get('items').then(response =>{
            setItems( response.data );
        });
    }, []);

    useEffect (()=>{
        axios.get<IBGEUFResponse []>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/').then(response => {
           const ufInitials = response.data.map(uf => uf.sigla) 

           setUfs(ufInitials);
        });
    }, []);

    useEffect (() => {
        if (selectedUF === "0") {
            setCities([]);
            setSelectedCity("0");
            return;
        }
        axios.get<IBGECityResponse []>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
           const CityNames = response.data.map(city => city.nome) 

           setCities(CityNames);
        });
    }, [selectedUF]);

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition ([
            event.latlng.lat,
            event.latlng.lng,
        ])
    }


    function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;

        setSelectedUF(uf);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectedCity(city);
    }

    function MapClick({ onClick }: { onClick: (e: LeafletMouseEvent) => void }) {
    useMapEvents({
        click: (e) => onClick(e),
    });
    return null; // não renderiza nada
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value })
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if(alreadySelected >= 0 ){
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([ ...selectedItems, id ]);
        }
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUF;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items,
        };

        await api.post('points', data);

        alert('Ponto de coleta criado!');

        navigate("/");
    }


    return (
        <div id="page-create-point">

            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home 
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                        type="text" 
                        name="name"
                        id="name"
                        onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                            type="email" 
                            name="email"
                            id="email"
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                            type="text" 
                            name="whatsapp"
                            id="whatsapp"
                            onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    {initialPosition && (
                    <MapContainer
                        key={initialPosition.join(",")}
                        center={initialPosition}             
                        zoom={15}  
                        >
                        <MapClick onClick={handleMapClick} />
                        <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </MapContainer>
                    )}
                    {!initialPosition && <p>Carregando mapa...</p>}

                <div className="field-group">
                    <div className="field">
                        <label htmlFor="uf">Estado (UF)</label>
                        <select name="uf" id="uf" value={selectedUF} onChange={handleSelectedUF}>
                            <option value="0">Selecione uma UF</option>
                            {ufs.map(uf=> (
                               <option key={uf} value={uf}>{uf}</option> 
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="city">Cidade</label>
                        <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity}>
                            <option value="0">Selecione uma cidade</option>
                            {cities.map(city=> (
                               <option key={city} value={city}>{city}</option> 
                            ))}
                        </select>
                    </div>
                </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map( item => (
                            <li 
                            key={item.id} 
                            onClick={() => handleSelectItem(item.id)}
                            className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                            <img src={item.image_url} alt={item.title} />
                            <span>{item.title}</span>
                            <span></span>
                        </li>
                        ))}
                       
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
}

export default CreatePoint;