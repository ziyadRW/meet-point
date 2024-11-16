import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

function SuccessModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center">
        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
          <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <p className="mt-4 text-xl font-semibold">Invitations Sent Successfully!</p>
      </div>
    </div>
  );
}

export default function InvitationPage({ locations, selectedPlace }) {
  const navigate = useNavigate();
  const [meetingDate, setMeetingDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const [meetingTime, setMeetingTime] = useState('');
  const [invitationMessage, setInvitationMessage] = useState(() => {
    return `Hello,

You are invited to meet at ${selectedPlace?.name || 'the selected place'} located at ${selectedPlace?.formatted_address || 'the given location'}.

Date: ${meetingDate}
Time: ${meetingTime || 'TBD'}

Please confirm your availability.

Best regards,
MeetPoint Team`;
  });

  const [participants, setParticipants] = useState(locations);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/sendInvitations", {
        participants,
        meetingDate,
        meetingTime,
        invitationMessage,
        selectedPlace,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Failed to send invitations. Please try again.');
    }
  };
  

  const handleParticipantChange = (index, key, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][key] = value;
    setParticipants(updatedParticipants);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/');
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/results')}
        className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium mb-6"
      >
        <FaArrowLeft className="mr-2 h-4 w-4" />
        Back to Results
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">Send Invitations</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Participants</h3>
          {participants.map((participant, index) => (
            <div key={index} className="flex items-center justify-between mb-2">
              <input
                type="text"
                value={participant.name || `Person ${index + 1}`}
                onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                className="w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name"
              />
              <input
                type="email"
                value={participant.email || ''}
                onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                className="w-2/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
                required
              />
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Meeting Details</h3>
          <div className="flex gap-4 mb-4">
            <input
              type="date"
              value={meetingDate}
              onChange={(e) => {
                setMeetingDate(e.target.value);
                setInvitationMessage((prevMessage) =>
                  prevMessage.replace(/Date: .*/, `Date: ${e.target.value}`)
                );
              }}
              className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="time"
              value={meetingTime}
              onChange={(e) => {
                setMeetingTime(e.target.value);
                setInvitationMessage((prevMessage) =>
                  prevMessage.replace(/Time: .*/, `Time: ${e.target.value}`)
                );
              }}
              className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <textarea
            value={invitationMessage}
            onChange={(e) => setInvitationMessage(e.target.value)}
            placeholder="Enter invitation message"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Send Invitations
          </button>
        </div>
      </form>

      <SuccessModal isOpen={isModalOpen} onClose={closeModal} />

      <style jsx>{`
        .checkmark__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #7ac142;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: block;
          stroke-width: 2;
          stroke: #fff;
          stroke-miterlimit: 10;
          margin: 10% auto;
          box-shadow: inset 0px 0px 0px #7ac142;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
        }

        .checkmark__check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }

        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes scale {
          0%, 100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }

        @keyframes fill {
          100% {
            box-shadow: inset 0px 0px 0px 30px #7ac142;
          }
        }
      `}</style>
    </div>
  );
}