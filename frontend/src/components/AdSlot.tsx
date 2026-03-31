type AdSlotProps = {
  type?: 'banner' | 'inline';
};

export default function AdSlot({ type = 'inline' }: AdSlotProps) {
  return (
    <div
      style={{
        width: '100%',
        minHeight: type === 'banner' ? '120px' : '250px',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px 0',
      }}
    >
      <span>Ad Space</span>
    </div>
  );
}