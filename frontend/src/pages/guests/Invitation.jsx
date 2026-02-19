
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Invitation() {
    const { ref } = useParams();
    const navigate = useNavigate();
    const [invitation, setInvitation] = useState(null);
    const [guestName, setGuestName] = useState('');
    const [answer, setAnswer] = useState('');
    const [partnerName, setPartnerName] = useState('');

    useEffect(() => {
        const guest = new URLSearchParams(window.location.search).get('guest');
        if (guest) {
            setGuestName(guest);
        }

        fetch(`/api/v2/invitations/${ref}?${guest ? 'guest=' + guest : ''}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setInvitation(data))
            .catch(error => console.error('Error fetching invitation:', error));
    }, [ref]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const rsvpRequest = {
            guestName,
            answer,
            partnerName,
        };

        fetch(`/api/v2/invitations/${ref}/responses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rsvpRequest),
        })
        .then(response => {
            if (response.ok) {
                navigate('/events');
            } else {
                console.error('Error submitting RSVP');
            }
        })
        .catch(error => console.error('Error submitting RSVP:', error));
    };

    if (!invitation) {
        return <div>Loading...</div>;
    }

    const containerStyle = {
        backgroundImage: `url(${invitation.backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };

    return (
        <div style={containerStyle} className="min-h-screen flex items-center justify-center font-serif text-gray-800">
            <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-xl text-center">
                <h1 className="text-5xl mb-4">{invitation.brideName} & {invitation.groomName}</h1>
                <p className="text-2xl mb-2">We are getting married!</p>
                <p className="text-xl mb-6">{new Date(invitation.eventDate).toLocaleString()}</p>
                <p className="text-lg mb-4">{invitation.ceremonyVenue}</p>
                <p className="text-lg mb-8">{invitation.receptionVenue}</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-lg mb-2" htmlFor="guestName">Your Name</label>
                        <input
                            type="text"
                            id="guestName"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <p className="text-lg mb-2">Will you be attending?</p>
                        <label className="mr-4">
                            <input
                                type="radio"
                                name="rsvp"
                                value="ACCEPTED"
                                checked={answer === 'ACCEPTED'}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="mr-2"
                            />
                            Accept
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="rsvp"
                                value="DECLINED"
                                checked={answer === 'DECLINED'}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="mr-2"
                            />
                            Decline
                        </label>
                    </div>
                    {answer === 'ACCEPTED' && (
                         <div className="mb-4">
                            <label className="block text-lg mb-2" htmlFor="partnerName">Partner's Name (Optional)</label>
                            <input
                                type="text"
                                id="partnerName"
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    )}
                    <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                        Submit RSVP
                    </button>
                </form>
            </div>
        </div>
    );
}
