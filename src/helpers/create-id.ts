function createLeadId() {
  return `L_${crypto.randomUUID()}`;
}

export default createLeadId;