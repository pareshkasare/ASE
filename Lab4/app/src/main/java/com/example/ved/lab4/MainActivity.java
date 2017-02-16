package com.example.ved.lab4;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AutoCompleteTextView;
import android.widget.EditText;
import android.content.Context;
import android.widget.ImageView;
import android.widget.TextView;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;

import java.net.URL;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class MainActivity extends AppCompatActivity {

    private EditText mURL;
    private TextView moutputTextView;
    private static final String IBMWATSONAPI = "https://watson-api-explorer.mybluemix.net/visual-recognition/api/v3/classify?";
    private static final String VERSION = "2016-05-20";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
    public void logout(View v) {
        Intent redirect = new Intent(MainActivity.this, LoginActivity.class);
        redirect.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(redirect);
    }
    public void process_image(View v){

        System.out.println("in process_image");
        mURL = (EditText)findViewById(R.id.url);
        moutputTextView = (TextView)findViewById(R.id.outptextView);

        String url = mURL.getText().toString();

        String getURL = IBMWATSONAPI+"api_key="+getApplicationContext().getString(R.string.API_KEY)+
                "&url="+url+"&classifier_ids=default&version="+VERSION;
        System.out.println(getURL);
        if(isValidUrl(url)){
            mURL.clearFocus();
            new DownloadImageTask((ImageView) findViewById(R.id.imageView1))
                    .execute(url);
            final String response1 = "";
            OkHttpClient client = new OkHttpClient();
            try {

                //JSONObject json = getJSON(url);
                Request request = new Request.Builder()
                        .url(getURL)
                        .build();
                client.newCall(request).enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        System.out.println("Error in call");
                        final String error_text= "Something went wrong!!!";
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                moutputTextView.setText(error_text);
                            }
                        });
                        System.out.println(e.getMessage());
                    }
                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        System.out.println("onresponsesuccess");
                        final JSONObject jsonResult;
                        final String result = response.body().string();
                        System.out.println(result);
                        try {
                            jsonResult = new JSONObject(result);
                            JSONArray images = jsonResult.getJSONArray("images");
                            JSONObject classifiers_obj = images.getJSONObject(0);
                            System.out.println(classifiers_obj.toString());
                            JSONArray classifiers = classifiers_obj.getJSONArray("classifiers");
                            JSONObject classes_object= classifiers.getJSONObject(0);
                            JSONArray classes = classes_object.getJSONArray("classes");
                            String text ="IBM Watson determines that image shown above contains  ";
                            for(int i=0; i<classes.length();i++){
                                JSONObject obj = classes.getJSONObject(i);
                                Double score = obj.getDouble("score");
                                String search_string = obj.getString("class");
                                search_string=search_string.toLowerCase();
                                String article="";
                                if(score >= 0.45 && (search_string.startsWith("a") ||search_string.startsWith("e")
                                        || search_string.startsWith("i") || search_string.startsWith("o")
                                        || search_string.startsWith("u"))) {
                                    article = " an ";
                                }
                                else {
                                    article = " a ";
                                }
                                if(score >= 0.95 && score < 1.00 )
                                {
                                    text = text  + " quite confidently"
                                            + article + search_string;
                                }
                                else if (score >= 0.85 && score < 0.95){

                                    text = text  + " possibly"
                                            +article+ search_string;

                                }
                                else if (score >= 0.45 && score < 0.85){

                                    text = text  + " may be"
                                            +article+ search_string;
                                }
                            }
                            final String final_text= text+".";
                            runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    moutputTextView.setText(final_text);
                                }
                            });
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });
            } catch (Exception ex) {
                moutputTextView.setText(ex.getMessage());

            }
        }
        else {
            mURL.setError(getString(R.string.error_invalid_URL));
            mURL.requestFocus();
        }

    }
    private boolean isValidUrl(String url) {
        //TODO: Replace this with your own logic
        return url.contains(".");
    }

    private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
        ImageView bmImage;

        public DownloadImageTask(ImageView bmImage) {
            this.bmImage = bmImage;
        }

        protected Bitmap doInBackground(String... urls) {
            String urldisplay = urls[0];
            Bitmap mIcon11 = null;
            try {
                InputStream in = new java.net.URL(urldisplay).openStream();
                mIcon11 = BitmapFactory.decodeStream(in);
            } catch (Exception e) {
                Log.e("Error", e.getMessage());
                e.printStackTrace();
            }
            return mIcon11;
        }

        protected void onPostExecute(Bitmap result) {
            bmImage.setImageBitmap(result);
        }
    }
}
