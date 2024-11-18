export const initiateRoastCall = async (formData) => {
  try {
    const response = await fetch('https://roast-call-proxy.vercel.app/proxy/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone_number: `${formData.countryCode}${formData.phone}`,
        task: `You are calling ${formData.name}. Their job is: ${formData.job}. Greet them very quickly and roast them hard for their hobby which is: ${formData.description}. Be as mean as possible`,
        model: "enhanced",
        language: "en",
        voice: "nat",
        max_duration: 12,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to initiate call');
    }

    return true;
  } catch (error) {
    console.error('Call initiation error:', error);
    throw error;
  }