exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (!process.env.OPENSEA_API_KEY) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ error: 'no_key', message: 'OPENSEA_API_KEY not set — showing cached data' })
    };
  }

  try {
    const [statsRes, activityRes] = await Promise.all([
      fetch('https://api.opensea.io/api/v2/collections/booa/stats', {
        headers: {
          'x-api-key': process.env.OPENSEA_API_KEY,
          'accept': 'application/json'
        }
      }),
      fetch('https://api.opensea.io/api/v2/events/collection/booa?event_type=sale&limit=8', {
        headers: {
          'x-api-key': process.env.OPENSEA_API_KEY,
          'accept': 'application/json'
        }
      })
    ]);

    const stats    = await statsRes.json();
    const activity = await activityRes.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ stats, activity })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
