import videoService from "../AserverAuth/config";

const transcriptFetchService = {



    
    async fetchAndProcessTranscript (videoId, includeOriginal = false) {
        // console.log("inside utility function here:", videoId)
    const transcriptResponse = await videoService.getTranscript(videoId);
    const transcriptData = transcriptResponse.data.transcript;

    // If transcript is missing, empty, or contains "NA", return null
    if (
      !transcriptData || 
      (!transcriptData.english?.length && !transcriptData.original?.length) || 
      transcriptData.original === "NA"
    ) {
      // console.log("Transcript is empty. Skipping chat message request.");
      return null;
    }
    
    // Extract English transcript text
    const transcriptText = transcriptData.english?.map(entry => entry.text).join("\n") || "";
    
    // Extract original transcript text only if includeOriginal is true
    const transcriptTextOriginal = includeOriginal
      ? transcriptData.original?.map(entry => entry.text).join("\n") || ""
      : null;

      return {
      transcriptData,
      transcriptText,
      transcriptTextOriginal: includeOriginal ? transcriptTextOriginal : undefined,
    };
}

}
export default transcriptFetchService