// src/api/matchmaking.ts
import client from './axiosInstance'; // ensure you have axiosInstance.ts that exports configured axios
// baseURL is your matchmaking service (from PRD) e.g. process.env.MATCHMAKING_API

export async function findDriverNearby(coords: { latitude: number; longitude: number }) {
  const res = await client.post('/v1/find', coords);
  return res.data;
}

export async function driverAcceptRequest(requestId: string, driverId: string) {
  const res = await client.post(`/v1/requests/${requestId}/accept`, { driverId });
  return res.data;
}

export async function driverRejectRequest(requestId: string, driverId: string) {
  const res = await client.post(`/v1/requests/${requestId}/reject`, { driverId });
  return res.data;
}
