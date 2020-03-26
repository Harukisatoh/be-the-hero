import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

// Imports logout and trash icon from feather icon pack
import { FiPower, FiTrash2 } from 'react-icons/fi';

// Imports backend api created with axios
import api from '../../services/api';

// Imports style features
import './styles.css';
import logoImg from '../../assets/logo.svg';

// Profile component
function Profile() {
  // Gets NGO id and name from browser's local storage
  const ngoId = localStorage.getItem('ngoId');
  const ngoName = localStorage.getItem('ngoName');

  // Creates a state to store each incident from that NGO
  const [incidents, setIncidents] = useState([]);

  // Gets history instance
  const history = useHistory();

  /**
   * useEffect is a function that is called when something changes,
   * in this case, when ngoId change. So it's just called once in the app.
   */
  useEffect(() => {
    // Gets all incidents from the specific ngo
    api.get('/profile', {
      headers: {
        Authorization: ngoId
      }
    }).then(response => { // And then stores the incidents into incidents state
      setIncidents(response.data);
    });
  }, [ngoId]);

  // Function called when you click the delete button
  async function handleDeleteIncident(id) {
    try {
      // Tries to delete the specific incident
      await api.delete(`/incidents/${id}`, {
        headers: {
          Authorization: ngoId
        }
      });

      // And updates incidents state
      setIncidents(incidents.filter(incident => incident.id !== id));
    } catch (error) {
      alert('Erro ao deletar o caso, tente novamente!');
    }
  }

  // Function called when you click the logout button
  function handleLogout() {
    // Clears the local storage
    localStorage.clear();

    // And redirects the user to login page
    history.push('/');
  }

  // Html returned when the component is rendered
  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be The Hero" />
        <span>Bem vindo(a), {ngoName}</span>

        {/**
         * Link: it's just a component similar to the HTML <a> tag,
         * but in this case, it prevents the browser from reloading
         * 
         * FiPower: it's an icon in a component format, this icon was
         * imported from feather icons pack
         */}

        <Link className="button" to="/incidents/new">Cadastrar um novo caso</Link>
        <button onClick={handleLogout} type="button">
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1>Casos cadastrados</h1>

      {incidents.length === 0 && <h2>Você não tem nenhum caso cadastrado :(</h2>}

      <ul>
        {incidents.map(incident => {
          return (
            <li key={incident.id}>
              <strong>CASO:</strong>
              <p>{incident.title}</p>

              <strong>DESCRIÇÃO:</strong>
              <p>{incident.description}</p>

              <strong>VALOR:</strong>
              <p>
                {
                  /*
                  * Intl is a global function from javascript which formats
                  * numbers, in this case into BRL currency.
                  */
                  Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(incident.value)
                }
              </p>

              {/**
               * FiTrash2: it's an icon in a component format, this icon was
               * imported from feather icons pack
               */}

              <button onClick={() => handleDeleteIncident(incident.id)} type="button">
                <FiTrash2 size={20} color="#a8a8b3" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Exports component
export default Profile;