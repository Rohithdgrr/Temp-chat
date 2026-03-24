"use client";

export function EmptyState({ code, copied, onCopyCode }: { code: string; copied: boolean; onCopyCode: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6 border border-indigo-200 shadow-lg">
        <svg className="h-12 w-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Start the conversation</h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">Be the first to send a message! Share the room code with friends to chat together.</p>
      <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-200">
        <span className="font-mono text-gray-800 font-bold">{code}</span>
        <button onClick={onCopyCode} className="ml-2 p-1 hover:bg-indigo-100 rounded transition-colors">
          {copied ? (
            <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
