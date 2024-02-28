import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";

export default function App() {
  const [resultS, setResultS] = useState("");
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = "4fcfa4434cae441f90b79c9c2384c56e";
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "clarifai";
  const APP_ID = "main";
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = "food-item-recognition";
  const MODEL_VERSION_ID = "1d5fd481e0cf4826aa72ec3ff049e044";
  const IMAGE_URL =
    "https://cdn.tgdd.vn/Files/2022/01/25/1412805/cach-nau-pho-bo-nam-dinh-chuan-vi-thom-ngon-nhu-hang-quan-202201250230038502.jpg";
  //https://images.immediate.co.uk/production/volatile/sites/30/2017/01/Bunch-of-bananas-67e91d5.jpg

  ///////////////////////////////////////////////////////////////////////////////////
  // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
  ///////////////////////////////////////////////////////////////////////////////////

  const fetchResult = async () => {
    try {
      const raw = JSON.stringify({
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID,
        },
        inputs: [
          {
            data: {
              image: {
                url: IMAGE_URL,
              },
            },
          },
        ],
      });

      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Key " + PAT,
        },
        body: raw,
      };

      const response = await fetch(
        "https://api.clarifai.com/v2/models/" +
          MODEL_ID +
          "/versions/" +
          MODEL_VERSION_ID +
          "/outputs",
        requestOptions
      );

      const result = await response.json();
      if (result && result.outputs && result.outputs.length > 0) {
        // Accessing data from the first output, modify this based on your actual data structure
        setResultS(result.outputs[0].data);
      } else {
        console.log("No data found in the response");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchResult();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={{ uri: IMAGE_URL }} style={styles.image} />
      {resultS && resultS.concepts && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Concept with the largest value:</Text>
          <Text style={styles.resultText}>
            {
              resultS.concepts.reduce((maxConcept, concept) => {
                return concept.value > maxConcept.value ? concept : maxConcept;
              }, resultS.concepts[0]).name
            }
          </Text>
        </View>
      )}
      {resultS && resultS.concepts && (
        <View>
          <Text>All concepts recognized:</Text>
          {resultS.concepts.map((concept, index) => (
            <Text key={index}>
              {concept.name}: {concept.value}
            </Text>
          ))}
        </View>
      )}
      <Button title="Reload" onPress={fetchResult} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  resultContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
